using Application.Abstractions.Authentication;
using Application.Abstractions.Context;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Transactions;
using FluentValidation;
using SharedKernel;

namespace Application.Transactions.Bills;

public sealed record SaveBillCommand(SaveBillItem Bill, IReadOnlyList<SaveBillLoadItem> Loads)
    : ICommand<SaveBillResponse>;

internal sealed class SaveBillCommandHandler(
    IBillRepository billRepository,
    ILoadRepository loadRepository,
    IUnitOfWork unitOfWork,
    IFinancialYearContext financialYearContext,
    IUserContext userContext,
    IDateTimeProvider dateTimeProvider)
    : ICommandHandler<SaveBillCommand, SaveBillResponse>
{
    public async Task<Result<SaveBillResponse>> Handle(
        SaveBillCommand request,
        CancellationToken cancellationToken)
    {
        Result<int> financialYearId = FinancialYearRequest.Require(financialYearContext);
        if (financialYearId.IsFailure)
        {
            return Result.Failure<SaveBillResponse>(financialYearId.Error);
        }

        SaveBillItem item = request.Bill;
        string billNumber = item.BillNumber.Trim();

        Bill? bill;
        DateTime utcNow = dateTimeProvider.UtcNow;

        if (item.BillId is int billId and > 0)
        {
            bill = await billRepository.GetByIdForUpdateAsync(billId, cancellationToken);
            if (bill is null || bill.FinancialYearId != financialYearId.Value)
            {
                return Result.Failure<SaveBillResponse>(BillErrors.NotFound);
            }

            if (await billRepository.ExistsByBillNumberAsync(
                    financialYearId.Value,
                    billNumber,
                    bill.BillId,
                    cancellationToken))
            {
                return Result.Failure<SaveBillResponse>(BillErrors.BillNumberNotUnique);
            }

            ApplyBillFields(bill, item, billNumber);
            bill.UpdatedAt = utcNow;
            bill.UpdatedBy = userContext.UserId;
        }
        else
        {
            if (await billRepository.ExistsByBillNumberAsync(
                    financialYearId.Value,
                    billNumber,
                    excludeBillId: null,
                    cancellationToken))
            {
                return Result.Failure<SaveBillResponse>(BillErrors.BillNumberNotUnique);
            }

            bill = new Bill
            {
                FinancialYearId = financialYearId.Value,
                CreatedAt = utcNow,
                UpdatedAt = utcNow,
                CreatedBy = userContext.UserId,
                UpdatedBy = userContext.UserId,
            };

            ApplyBillFields(bill, item, billNumber);
            billRepository.Add(bill);
            await unitOfWork.SaveChangesAsync(cancellationToken);
        }

        await SyncLoadsAsync(
            bill,
            request.Loads,
            financialYearId.Value,
            utcNow,
            cancellationToken);

        await unitOfWork.SaveChangesAsync(cancellationToken);

        IReadOnlyList<Load> activeLoads = await loadRepository.GetActiveByBillIdAsync(bill.BillId, cancellationToken);

        return new SaveBillResponse(
            new BillDetailResponse(
                bill.ToResponse(),
                activeLoads.Select(x => x.ToLineResponse()).ToList()));
    }

    private static void ApplyBillFields(Bill bill, SaveBillItem item, string billNumber)
    {
        bill.BillNumber = billNumber;
        bill.BillDate = item.BillDate;
        bill.FromId = item.FromId;
        bill.TruckId = item.TruckId;
        bill.DriverName = item.DriverName.Trim();
        bill.DriverMobile = string.IsNullOrWhiteSpace(item.DriverMobile) ? null : item.DriverMobile.Trim();
        bill.TotalFreight = item.TotalFreight;
        bill.Commission = item.Commission;
        bill.Crossing = item.Crossing;
        bill.HandLoan = item.HandLoan;
        bill.TruckLoan = item.TruckLoan;
        bill.OfficeMamul = item.OfficeMamul;
        bill.TapalMamul = item.TapalMamul;
        bill.Diesel = item.Diesel;
        bill.Others = item.Others;
        bill.Total = item.Total;
        bill.IsCancelled = item.IsCancelled;
    }

    private async Task SyncLoadsAsync(
        Bill bill,
        IReadOnlyList<SaveBillLoadItem> loadItems,
        int financialYearId,
        DateTime utcNow,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<Load> existingLoads = await loadRepository.GetAllByBillIdForUpdateAsync(bill.BillId, cancellationToken);
        var existingById = existingLoads.ToDictionary(x => x.LoadId);
        var retainedLoadIds = new HashSet<int>();

        for (int index = 0; index < loadItems.Count; index++)
        {
            SaveBillLoadItem line = loadItems[index];
            int loadNumber = index + 1;

            if (line.LoadId is int loadId and > 0 && existingById.TryGetValue(loadId, out Load? existing))
            {
                retainedLoadIds.Add(loadId);
                ApplyLoadFields(existing, line, loadNumber, financialYearId);
                existing.IsActive = true;
                existing.UpdatedAt = utcNow;
                existing.UpdatedBy = userContext.UserId;
                continue;
            }

            var load = new Load
            {
                BillId = bill.BillId,
                LoadNumber = loadNumber,
                FinancialYearId = financialYearId,
                IsActive = true,
                CreatedAt = utcNow,
                UpdatedAt = utcNow,
                CreatedBy = userContext.UserId,
                UpdatedBy = userContext.UserId,
            };

            ApplyLoadFields(load, line, loadNumber, financialYearId);
            loadRepository.Add(load);
        }

        foreach (Load existing in existingLoads)
        {
            if (!retainedLoadIds.Contains(existing.LoadId))
            {
                existing.IsActive = false;
                existing.UpdatedAt = utcNow;
                existing.UpdatedBy = userContext.UserId;
            }
        }
    }

    private static void ApplyLoadFields(Load load, SaveBillLoadItem line, int loadNumber, int financialYearId)
    {
        load.LoadNumber = loadNumber;
        load.PartyId = line.PartyId;
        load.ToId = line.ToId;
        load.GoodsId = line.GoodsId;
        load.UnitId = line.UnitId;
        load.WeightOrQuantity = line.WeightOrQuantity;
        load.RatePerUnit = line.RatePerUnit;
        load.Freight = line.Freight;
        load.Advance = line.Advance;
        load.Topay = line.Topay;
        load.Balance = line.Balance;
        load.FinancialYearId = financialYearId;
    }
}

internal sealed class SaveBillCommandValidator : AbstractValidator<SaveBillCommand>
{
    public SaveBillCommandValidator()
    {
        RuleFor(x => x.Bill.BillNumber).NotEmpty().MaximumLength(64);
        RuleFor(x => x.Bill.FromId).GreaterThan(0);
        RuleFor(x => x.Bill.TruckId).GreaterThan(0);
        RuleFor(x => x.Bill.DriverName).NotEmpty().MaximumLength(256);
        RuleForEach(x => x.Loads).ChildRules(load =>
        {
            load.RuleFor(l => l.PartyId).GreaterThan(0);
            load.RuleFor(l => l.ToId).GreaterThan(0);
            load.RuleFor(l => l.GoodsId).GreaterThan(0);
            load.RuleFor(l => l.UnitId).GreaterThan(0);
        });
    }
}
