import {
  formatBillPreviewAmount,
  formatBillPreviewDate,
  formatBillPreviewWeight,
  prepareBillPreviewLoads,
} from '@/lib/billPreview';
import type { BillPreviewModel } from '@/types/billPreview';
import './bill-memo-template.css';

type BillMemoTemplateProps = {
  data: BillPreviewModel;
  className?: string;
};

/**
 * HTML/CSS truck memo matching the sample bill layout.
 * Maps app fields → print columns:
 * - Consignor / Consignee: party | Description: goods
 * - Weight + unit | Per Ton: rate | Total Freight | Advance | Balance
 */
export function BillMemoTemplate({ data, className }: BillMemoTemplateProps) {
  const loadRows = prepareBillPreviewLoads(data.loads, data.minLoadRows);
  const { company } = data;

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

        <section className="bill-memo__header-main">
          <div className="bill-memo__logo" aria-hidden>
            Logo
          </div>
          <div>
            <h1 className="bill-memo__company-name">{company.companyName}</h1>
            {company.addressLines.map((line) => (
              <p key={line} className="bill-memo__address">
                {line}
              </p>
            ))}
          </div>
          <dl className="bill-memo__truck-box">
            <dt>Truck No. :</dt>
            <dd>{data.truckNumber}</dd>
          </dl>
        </section>

        <section className="bill-memo__parties">
          <div className="bill-memo__party-col">
            <div className="bill-memo__field">
              <span className="bill-memo__field-label">Owner Name :</span>
              <span className="bill-memo__field-value">{data.ownerName}</span>
            </div>
            <div className="bill-memo__field">
              <span className="bill-memo__field-label">Owner Mo. :</span>
              <span className="bill-memo__field-value">{data.ownerMobile}</span>
            </div>
            <div className="bill-memo__field">
              <span className="bill-memo__field-label">Driver Name :</span>
              <span className="bill-memo__field-value">{data.driverName}</span>
            </div>
            <div className="bill-memo__field">
              <span className="bill-memo__field-label">Driver Mo. :</span>
              <span className="bill-memo__field-value">{data.driverMobile}</span>
            </div>
          </div>
          <div className="bill-memo__party-col">
            <div className="bill-memo__field">
              <span className="bill-memo__field-label">Memo No. :</span>
              <span className="bill-memo__field-value bill-memo__memo-no">
                {data.billNumber}
              </span>
            </div>
            <div className="bill-memo__field">
              <span className="bill-memo__field-label">Date :</span>
              <span className="bill-memo__field-value">
                {formatBillPreviewDate(data.billDate)}
              </span>
            </div>
            <div className="bill-memo__field">
              <span className="bill-memo__field-label">From :</span>
              <span className="bill-memo__field-value">{data.fromLocationName}</span>
            </div>
            <div className="bill-memo__field">
              <span className="bill-memo__field-label">Name Board :</span>
              <span className="bill-memo__field-value">{data.nameBoardName}</span>
            </div>
          </div>
        </section>

        <table className="bill-memo__loads">
          <thead>
            <tr>
              <th style={{ width: '14%' }}>Consignor</th>
              <th style={{ width: '14%' }}>Consignee</th>
              <th style={{ width: '18%' }}>Description of Goods</th>
              <th style={{ width: '10%' }}>Weight</th>
              <th style={{ width: '10%' }}>Per Ton</th>
              <th style={{ width: '12%' }}>Total Freight</th>
              <th style={{ width: '10%' }}>Advance</th>
              <th style={{ width: '12%' }}>Balance</th>
            </tr>
          </thead>
          <tbody>
            {loadRows.map((row) => (
              <tr key={row.loadNumber}>
                <td className="bill-memo__loads-cell--left">{row.consignorName}</td>
                <td className="bill-memo__loads-cell--left">{row.consigneeName}</td>
                <td className="bill-memo__loads-cell--left">{row.goodsName}</td>
                <td>
                  {formatBillPreviewWeight(row.weightOrQuantity, row.unitName)}
                </td>
                <td>{formatBillPreviewAmount(row.ratePerUnit)}</td>
                <td>{formatBillPreviewAmount(row.freight)}</td>
                <td>{formatBillPreviewAmount(row.advance)}</td>
                <td>{formatBillPreviewAmount(row.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="bill-memo__loads-footer">
          <div>
            <span className="bill-memo__field-label">Truck Name :</span>
            <span className="bill-memo__field-value">{data.nameBoardName}</span>
          </div>
          <div>
            <span className="bill-memo__field-label">Truck Loan :</span>
            <span className="bill-memo__field-value">
              {formatBillPreviewAmount(data.truckLoan)}
            </span>
          </div>
        </div>

        <footer className="bill-memo__footer">
          <div className="bill-memo__terms">
            <p>
              1. We are not responsible for any loss by transshipment and any other
              miss happening.
            </p>
            <p>
              2. We are not responsible for any shortage, leakage or breakage.
            </p>
            <p>3. We are not responsible for any accident en-route.</p>
            <p>
              4. Goods must be delivered at the address of consignee only.
            </p>
            <p>
              5. Consignor / consignee will verify goods while taking delivery of goods.
            </p>
          </div>
          <table className="bill-memo__summary">
            <tbody>
              <tr>
                <th>Commission</th>
                <td>{formatBillPreviewAmount(data.commission)}</td>
              </tr>
              <tr>
                <th>Loading Charges</th>
                <td>{formatBillPreviewAmount(data.officeMamul)}</td>
              </tr>
              <tr>
                <th>Hamali/Guide</th>
                <td>{formatBillPreviewAmount(data.tapalMamul)}</td>
              </tr>
              <tr>
                <th>Crossing</th>
                <td>{formatBillPreviewAmount(data.crossing)}</td>
              </tr>
              <tr>
                <th>Hand Loan</th>
                <td>{formatBillPreviewAmount(data.handLoan)}</td>
              </tr>
              <tr>
                <th>Diesel</th>
                <td>{formatBillPreviewAmount(data.diesel)}</td>
              </tr>
              {data.others.map((item, index) => (
                <tr key={`other-${index}-${item.key}`}>
                  <th>{item.key.trim() || 'Other'}</th>
                  <td>{formatBillPreviewAmount(item.value)}</td>
                </tr>
              ))}
              <tr>
                <th>Total Freight</th>
                <td>{formatBillPreviewAmount(data.totalFreight)}</td>
              </tr>
              <tr className="bill-memo__summary-total">
                <th>TOTAL</th>
                <td>{formatBillPreviewAmount(data.total)}</td>
              </tr>
            </tbody>
          </table>
        </footer>

        <div className="bill-memo__signatures">
          <div>Truck Owner&apos;s &amp; Driver&apos;s Signature</div>
          <div>{company.signatureLabel}</div>
        </div>
      </div>
    </article>
  );
}
