import {
  BILL_MEMO_PAY_BY_OPTIONS,
  buildBillPreviewChargeRows,
  formatBillPreviewAmount,
  formatBillPreviewConsigneeName,
  formatBillPreviewDate,
  formatBillPreviewWeight,
  prepareBillPreviewLoads,
  resolveBillMemoLoadsSectionMinHeight,
  BILL_MEMO_BASELINE_CHARGE_ROW_COUNT,
} from '@/lib/billPreview';
import type { BillPreviewModel } from '@/types/billPreview';
import type { CSSProperties } from 'react';
import './bill-memo-template.css';

type BillMemoTemplateProps = {
  data: BillPreviewModel;
  className?: string;
};

const LOAD_COLUMNS = [
  { key: 'sno', label: 'S. No.', className: 'bill-memo__loads-col--sno' },
  { key: 'consignor', label: 'Consignor', className: 'bill-memo__loads-col--party' },
  { key: 'consignee', label: 'Consignee', className: 'bill-memo__loads-col--party' },
  { key: 'goods', label: 'Goods', className: 'bill-memo__loads-col--goods' },
  { key: 'weight', label: 'Weight', className: 'bill-memo__loads-col--num' },
  { key: 'rate', label: 'Rate', className: 'bill-memo__loads-col--num' },
  { key: 'freight', label: 'Freight', className: 'bill-memo__loads-col--num' },
  { key: 'advance', label: 'Advance', className: 'bill-memo__loads-col--num' },
  { key: 'topay', label: 'To Pay', className: 'bill-memo__loads-col--num' },
  { key: 'balance', label: 'Balance', className: 'bill-memo__loads-col--num' },
] as const;

/**
 * HTML/CSS truck memo matching Bill_sample_photo.jpeg.
 * Loads section grows on A4; at most 3 load rows.
 */
export function BillMemoTemplate({ data, className }: BillMemoTemplateProps) {
  const loadRows = prepareBillPreviewLoads(data.loads);
  const { company } = data;
  const chargeRows = buildBillPreviewChargeRows(data);
  const loadsSectionMinHeight = resolveBillMemoLoadsSectionMinHeight(chargeRows.length, data.payBy);
  const showUpiPaidFields = data.payBy === 'upi';
  const compactLoadsSection = chargeRows.length > BILL_MEMO_BASELINE_CHARGE_ROW_COUNT + 1;
  const loadsSectionStyle = {
    '--bill-memo-loads-min-height': `${loadsSectionMinHeight}px`,
  } as CSSProperties;

  return (
    <article
      className={[
        'bill-memo',
        data.isCancelled ? 'bill-memo--cancelled' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Bill preview"
    >
      <div className="bill-memo__outer">
        <header className="bill-memo__top">
          <div className="bill-memo__motto">{company.motto}</div>
          <div className="bill-memo__banner">
            <div>{company.titleTop}</div>
            <div>{company.titleBottom}</div>
          </div>
          <div className="bill-memo__phone">{company.phone}</div>
        </header>

        <section className="bill-memo__brand-row">
          <div className="bill-memo__logo" aria-hidden />
          <div className="bill-memo__brand-copy">
            <h1 className="bill-memo__company-name">
              <span className="bill-memo__company-name-main">{company.companyNameMain}</span>
              <span className="bill-memo__company-name-sub">{company.companyNameSub}</span>
            </h1>
            {company.addressLines.map((line) => (
              <p key={line} className="bill-memo__address">
                {line}
              </p>
            ))}
          </div>
          <dl className="bill-memo__truck-box">
            <dt>Truck Number :</dt>
            <dd>{data.truckNumber}</dd>
          </dl>
        </section>

        <section className="bill-memo__meta">
          <div className="bill-memo__meta-row">
            <div className="bill-memo__field">
              <span className="bill-memo__field-label">Owner Name :</span>
              <span className="bill-memo__field-value">{data.ownerName}</span>
            </div>
            <div className="bill-memo__meta-split">
              <div className="bill-memo__field">
                <span className="bill-memo__field-label">Memo No. :</span>
                <span className="bill-memo__field-value bill-memo__memo-no">{data.billNumber}</span>
              </div>
              <div className="bill-memo__field">
                <span className="bill-memo__field-label">Date :</span>
                <span className="bill-memo__field-value">
                  {formatBillPreviewDate(data.billDate)}
                </span>
              </div>
            </div>
          </div>
          <div className="bill-memo__meta-row">
            <div className="bill-memo__field">
              <span className="bill-memo__field-label">Owner Mobile :</span>
              <span className="bill-memo__field-value">{data.ownerMobile}</span>
            </div>
            <div className="bill-memo__field">
              <span className="bill-memo__field-label">From :</span>
              <span className="bill-memo__field-value">{data.fromLocationName}</span>
            </div>
          </div>
          <div className="bill-memo__meta-row">
            <div className="bill-memo__field">
              <span className="bill-memo__field-label">Driver Name :</span>
              <span className="bill-memo__field-value">{data.driverName}</span>
            </div>
            <div className="bill-memo__field">
              <span className="bill-memo__field-label">To :</span>
              <span className="bill-memo__field-value">{data.toLocationName}</span>
            </div>
          </div>
          <div className="bill-memo__meta-row">
            <div className="bill-memo__field">
              <span className="bill-memo__field-label">Driver Mobile :</span>
              <span className="bill-memo__field-value">
                {[data.driverMobile1, data.driverMobile2].filter((m) => m.trim()).join(', ')}
              </span>
            </div>
            <div className="bill-memo__field">
              <span className="bill-memo__field-label">Name Board :</span>
              <span className="bill-memo__field-value">{data.nameBoardName}</span>
            </div>
          </div>
        </section>

        <section
          className={[
            'bill-memo__loads-section',
            compactLoadsSection ? 'bill-memo__loads-section--compact' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          style={loadsSectionStyle}
        >
          <div className="bill-memo__loads-head">
            {LOAD_COLUMNS.map((column) => (
              <div key={column.key} className={column.className}>
                {column.label}
              </div>
            ))}
          </div>
          <div className="bill-memo__loads-body">
            {loadRows.map((row) => (
              <div key={row.loadNumber} className="bill-memo__loads-row">
                <div className="bill-memo__loads-col--sno">{row.loadNumber}</div>
                <div className="bill-memo__loads-col--party bill-memo__loads-cell--left">
                  {row.consignorName}
                </div>
                <div
                  className={[
                    'bill-memo__loads-col--party bill-memo__loads-cell--left bill-memo__loads-consignee',
                    row.asPerBill ? 'bill-memo__loads-consignee--as-per-bill' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <span
                    className={[
                      'bill-memo__loads-consignee-name',
                      row.asPerBill ? 'bill-memo__loads-consignee-name--as-per-bill' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {formatBillPreviewConsigneeName(row.consigneeName, row.asPerBill)}
                  </span>
                  {row.toLocationName?.trim() ? (
                    <span className="bill-memo__loads-consignee-to">
                      To: {row.toLocationName.trim()}
                    </span>
                  ) : null}
                </div>
                <div className="bill-memo__loads-col--goods bill-memo__loads-cell--left">
                  {row.goodsName}
                </div>
                <div className="bill-memo__loads-col--num">
                  {formatBillPreviewWeight(row.weightOrQuantity, row.unitName)}
                </div>
                <div className="bill-memo__loads-col--num bill-memo__loads-rate">
                  {formatBillPreviewAmount(row.ratePerUnit)}
                  {row.unitName?.trim() ? (
                    <sub className="bill-memo__loads-rate-unit">{row.unitName.trim()}</sub>
                  ) : null}
                </div>
                <div className="bill-memo__loads-col--num">
                  {formatBillPreviewAmount(row.freight)}
                </div>
                <div className="bill-memo__loads-col--num">
                  {formatBillPreviewAmount(row.advance)}
                </div>
                <div className="bill-memo__loads-col--num">
                  {formatBillPreviewAmount(row.topay)}
                </div>
                <div className="bill-memo__loads-col--num">
                  {formatBillPreviewAmount(row.balance)}
                </div>
              </div>
            ))}
            <div className="bill-memo__loads-body-fill" aria-hidden>
              {LOAD_COLUMNS.map((column) => (
                <div key={column.key} className={column.className} />
              ))}
            </div>
          </div>
          <div className="bill-memo__loads-foot">
            <div className="bill-memo__loads-foot-sno" aria-hidden />
            <div className="bill-memo__loads-foot-loan-label">Truck Loan</div>
            <div className="bill-memo__loads-foot-loan-value">
              {data.truckLoan ? 'Yes' : ''}
            </div>
            <div className="bill-memo__loads-foot-label-cell">Total Freight</div>
            <div className="bill-memo__loads-foot-freight-value">
              {formatBillPreviewAmount(data.totalFreight)}
            </div>
            <div className="bill-memo__loads-foot-spacer bill-memo__loads-foot-spacer--advance" aria-hidden />
            <div className="bill-memo__loads-foot-spacer bill-memo__loads-foot-spacer--topay" aria-hidden />
            <div className="bill-memo__loads-foot-spacer bill-memo__loads-foot-spacer--balance" aria-hidden />
          </div>
        </section>

        <section className="bill-memo__footer-grid">
          <div className="bill-memo__footer-col">
            <section className="bill-memo__footer-section">
              <h3 className="bill-memo__footer-section-title">Terms &amp; conditions</h3>
              <div className="bill-memo__disclaimer" aria-label="Terms and conditions">
                {company.terms.map((line, index) => (
                  <p key={`term-${index + 1}`} className="bill-memo__disclaimer-text">
                    <span className="bill-memo__disclaimer-marker">{index + 1}.</span>
                    <span className="bill-memo__disclaimer-body">{line}</span>
                  </p>
                ))}
              </div>
            </section>

            <section className="bill-memo__footer-section">
              <h3 className="bill-memo__footer-section-title">Payment Summary</h3>
              <table className="bill-memo__pay-table">
              <thead>
                <tr>
                  <th className="bill-memo__pay-table-corner">Payment</th>
                  {BILL_MEMO_PAY_BY_OPTIONS.map((option) => (
                    <th key={option.value}>
                      <div className="bill-memo__pay-table-option">
                        <span className="bill-memo__pay-table-check-slot" aria-hidden>
                          {data.payBy === option.value ? '✓' : ''}
                        </span>
                        <span className="bill-memo__pay-table-label">{option.label}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              {showUpiPaidFields ? (
                <tbody>
                  <tr>
                    <th>Name</th>
                    <td colSpan={3}>{data.paidName}</td>
                  </tr>
                  <tr>
                    <th>Mobile</th>
                    <td colSpan={3}>{data.paidMobile}</td>
                  </tr>
                </tbody>
              ) : null}
              </table>
            </section>
          </div>

          <div className="bill-memo__footer-col">
            <section className="bill-memo__footer-section">
              <h3 className="bill-memo__footer-section-title">Charges &amp; Total</h3>
              <table className="bill-memo__summary bill-memo__summary--charges">
              <tbody>
                {chargeRows.map((row) => (
                  <tr
                    key={row.key}
                    className={row.key === 'total' ? 'bill-memo__summary-total' : undefined}
                  >
                    <th>{row.label}</th>
                    <td>{formatBillPreviewAmount(row.value)}</td>
                  </tr>
              ))}
              </tbody>
              </table>
            </section>

            {data.advanceSummary ? (
              <section className="bill-memo__footer-section">
                <h3 className="bill-memo__footer-section-title">Advance Summary</h3>
                <table className="bill-memo__ledger-summary">
                  <tbody>
                    <tr>
                      <th>Advance</th>
                      <td>{formatBillPreviewAmount(data.advanceSummary.advance)}</td>
                    </tr>
                    <tr>
                      <th>Commission</th>
                      <td>{formatBillPreviewAmount(data.advanceSummary.commission)}</td>
                    </tr>
                    <tr>
                      <th>Balance</th>
                      <td>{formatBillPreviewAmount(data.advanceSummary.balance)}</td>
                    </tr>
                  </tbody>
                </table>
              </section>
            ) : null}
          </div>
        </section>

        <div className="bill-memo__bottom">
          <div className="bill-memo__signatures">
            <div className="bill-memo__signature-block">
              <div className="bill-memo__signature-space" aria-hidden />
              <div>Truck Owner&apos;s &amp; Driver&apos;s Signature</div>
            </div>
            <div className="bill-memo__signature-block bill-memo__signature-block--right">
              <div className="bill-memo__signature-space" aria-hidden />
              <div>{company.signatureLabel}</div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
