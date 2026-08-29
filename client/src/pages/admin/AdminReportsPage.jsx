import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Boxes, ClipboardList, Download, Printer, ReceiptText, TriangleAlert, TrendingUp, Users2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  Cell,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import AdminPageShell from '../../components/AdminPageShell';
import { useApp } from '../../context/AppContext';
import { adminApi } from '../../lib/adminApi';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const currency = (value = 0) => `PKR ${Number(value || 0).toLocaleString('en-PK', { maximumFractionDigits: 0 })}`;

const COLORS = ['#8b5e3c', '#c58d57', '#eadfce', '#a67c52', '#d4a574'];

const formatDateTime = (value) =>
  new Date(value).toLocaleString('en-PK', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const PDF_PAGE_WIDTH = 794;
const PDF_PAGE_HEIGHT = 1123;
const PDF_PAGE_MARGIN = 80;
const PDF_A4_WIDTH_MM = 210;
const PDF_A4_HEIGHT_MM = 297;

const formatReportPeriod = (monthlyRevenue = []) => {
  if (!monthlyRevenue.length) return 'All Available Data';

  const sorted = [...monthlyRevenue].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });

  const formatter = new Intl.DateTimeFormat('en-PK', { month: 'short', year: 'numeric' });
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const start = formatter.format(new Date(first.year, first.month - 1, 1));
  const end = formatter.format(new Date(last.year, last.month - 1, 1));

  return start === end ? start : `${start} - ${end}`;
};

const chunkArray = (items = [], size = 10) => {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
};

function ReportExportDocument({ analytics }) {
  const generatedAt = new Date().toLocaleString('en-PK', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      style={{
        width: '794px',
        background: '#ffffff',
        color: '#1f1a17',
        padding: '32px 36px 40px',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '16px',
          borderBottom: '1px solid #eadfce',
          paddingBottom: '18px',
          marginBottom: '22px',
        }}
      >
        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#8b5e3c' }}>
            Junaid Furniture
          </div>
          <h1
            style={{
              margin: '8px 0 0',
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontSize: '34px',
              lineHeight: 1,
              fontWeight: 600,
            }}
          >
            Reports
          </h1>
          <p style={{ margin: '10px 0 0', maxWidth: '460px', fontSize: '12px', lineHeight: 1.6, color: '#6f665f' }}>
            Business performance overview with KPI, revenue, product, and transaction summaries prepared for executive review.
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#1f1a17' }}>Generated</div>
          <div style={{ marginTop: '4px', fontSize: '12px', color: '#6f665f' }}>{generatedAt}</div>
          <div
            style={{
              marginTop: '10px',
              display: 'inline-block',
              borderRadius: '999px',
              background: '#f7efe3',
              padding: '6px 10px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#8b5e3c',
            }}
          >
            A4 Business Report
          </div>
        </div>
      </div>

      <section style={{ marginBottom: '22px' }}>
        <h2 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: 700, color: '#1f1a17' }}>Key Performance Indicators</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
          {[
            { label: 'Total Revenue', value: currency(analytics.summary?.totalRevenue) },
            { label: 'Total Orders', value: analytics.summary?.totalOrders || 0 },
            { label: 'Total Customers', value: analytics.summary?.totalCustomers || 0 },
            { label: 'Total Products', value: analytics.summary?.totalProducts || 0 },
            { label: 'Average Order Value', value: currency(analytics.salesOverview?.averageOrderValue) },
            { label: 'Low Stock Products', value: analytics.summary?.lowStockProducts || 0 },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                borderRadius: '18px',
                border: '1px solid #f2e6db',
                background: '#fcfaf7',
                padding: '14px',
              }}
            >
              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6f665f' }}>
                {item.label}
              </div>
              <div style={{ marginTop: '10px', fontSize: '22px', fontWeight: 700, color: '#1f1a17' }}>{item.value}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '22px' }}>
        <h2 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: 700, color: '#1f1a17' }}>Revenue and Analytics Charts</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px' }}>
          <div style={{ borderRadius: '22px', border: '1px solid #f2e6db', background: '#ffffff', padding: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#1f1a17' }}>Revenue by Category</h3>
            <div style={{ marginTop: '10px', height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.categoryRevenue || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={82}
                    fill="#8884d8"
                    dataKey="revenue"
                  >
                    {(analytics.categoryRevenue || []).map((entry, index) => (
                      <Cell key={`pdf-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => currency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ borderRadius: '22px', border: '1px solid #f2e6db', background: '#ffffff', padding: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#1f1a17' }}>Monthly Revenue</h3>
            <div style={{ marginTop: '10px', height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.monthlyRevenue || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" tickFormatter={(value) => `PKR ${(value / 1000).toFixed(0)}k`} />
                  <RechartsTooltip formatter={(value) => currency(value)} />
                  <Line type="monotone" dataKey="revenue" stroke="#8b5e3c" strokeWidth={2} dot={{ fill: '#8b5e3c' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '22px' }}>
        <div style={{ borderRadius: '22px', border: '1px solid #f2e6db', background: '#ffffff', padding: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#1f1a17' }}>Category Performance</h3>
          <div style={{ marginTop: '10px', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.categoryPerformance || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#666" tickFormatter={(value) => `PKR ${(value / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" width={110} stroke="#666" />
                <RechartsTooltip formatter={(value) => currency(value)} />
                <Bar dataKey="revenue" fill="#8b5e3c" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '22px' }}>
        <h2 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: 700, color: '#1f1a17' }}>Top Selling Products</h2>
        <div style={{ borderRadius: '22px', border: '1px solid #f2e6db', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fcfaf7' }}>
                <th style={{ padding: '12px 14px', textAlign: 'left', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6f665f' }}>
                  Product
                </th>
                <th style={{ padding: '12px 14px', textAlign: 'right', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6f665f' }}>
                  Units
                </th>
                <th style={{ padding: '12px 14px', textAlign: 'right', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6f665f' }}>
                  Revenue
                </th>
                <th style={{ padding: '12px 14px', textAlign: 'right', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6f665f' }}>
                  Stock
                </th>
              </tr>
            </thead>
            <tbody>
              {(analytics.topSellingProducts || []).map((product) => (
                <tr key={product.productId} style={{ borderTop: '1px solid #f4ece3' }}>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: '#1f1a17' }}>{product.name}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontSize: '12px', color: '#1f1a17' }}>{product.unitsSold}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontSize: '12px', fontWeight: 700, color: '#1f1a17' }}>
                    {currency(product.revenue)}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontSize: '12px', color: '#1f1a17' }}>{product.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ marginBottom: '22px' }}>
        <h2 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: 700, color: '#1f1a17' }}>Recent Transactions</h2>
        <div style={{ borderRadius: '22px', border: '1px solid #f2e6db', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fcfaf7' }}>
                <th style={{ padding: '12px 14px', textAlign: 'left', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6f665f' }}>
                  Customer
                </th>
                <th style={{ padding: '12px 14px', textAlign: 'left', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6f665f' }}>
                  Order ID
                </th>
                <th style={{ padding: '12px 14px', textAlign: 'right', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6f665f' }}>
                  Amount
                </th>
                <th style={{ padding: '12px 14px', textAlign: 'center', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6f665f' }}>
                  Status
                </th>
                <th style={{ padding: '12px 14px', textAlign: 'right', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6f665f' }}>
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {(analytics.recentTransactions || []).map((transaction) => (
                <tr key={transaction.id} style={{ borderTop: '1px solid #f4ece3' }}>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: '#1f1a17' }}>{transaction.customer}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: '#1f1a17', fontWeight: 600 }}>{transaction.orderId}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontSize: '12px', fontWeight: 700, color: '#1f1a17' }}>
                    {currency(transaction.amount)}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#1f1a17' }}>
                    {transaction.status}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontSize: '12px', color: '#6f665f' }}>{formatDateTime(transaction.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: 700, color: '#1f1a17' }}>Sales Overview</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
          {[
            { label: 'Average Order Value', value: currency(analytics.salesOverview?.averageOrderValue) },
            { label: 'Best Selling Day', value: analytics.salesOverview?.bestSellingDay || 'N/A' },
            { label: 'Best Selling Month', value: analytics.salesOverview?.bestSellingMonth || 'N/A' },
            { label: 'Best Selling Category', value: analytics.salesOverview?.bestSellingCategory || 'N/A' },
            { label: 'Total Discount Given', value: currency(analytics.salesOverview?.totalDiscount) },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                borderRadius: '18px',
                background: '#f7efe3',
                padding: '14px',
              }}
            >
              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6f665f' }}>
                {item.label}
              </div>
              <div style={{ marginTop: '8px', fontSize: '15px', fontWeight: 700, color: '#1f1a17' }}>{item.value}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ReportPdfShell({ pageNumber, totalPages, title, subtitle, generatedAt, reportPeriod, children }) {
  return (
    <div
      data-pdf-page
      className="pdf-report-page"
      style={{
        position: 'relative',
        boxSizing: 'border-box',
        width: PDF_PAGE_WIDTH,
        minHeight: PDF_PAGE_HEIGHT,
        overflow: 'hidden',
        background: '#ffffff',
        color: '#1f1a17',
        padding: PDF_PAGE_MARGIN,
        fontFamily: 'Inter, system-ui, sans-serif',
        breakInside: 'avoid',
        pageBreakInside: 'avoid',
        breakAfter: 'page',
        pageBreakAfter: 'always',
      }}
    >
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', minHeight: PDF_PAGE_HEIGHT - PDF_PAGE_MARGIN * 2, flexDirection: 'column' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', gap: 20, borderBottom: '1px solid #eadfce', paddingBottom: 18, marginBottom: 18 }}>
          <div style={{ maxWidth: 420 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#8b5e3c' }}>Junaid Furniture</div>
            <h1 style={{ margin: '8px 0 0', fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 34, lineHeight: 1, fontWeight: 600 }}>{title}</h1>
            <p style={{ margin: '10px 0 0', fontSize: 12, lineHeight: 1.6, color: '#6f665f' }}>{subtitle}</p>
            <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <span style={{ borderRadius: 999, background: '#f7efe3', padding: '6px 10px', fontSize: 11, fontWeight: 700, color: '#8b5e3c' }}>
                Report Period: {reportPeriod}
              </span>
              <span style={{ borderRadius: 999, background: '#fcfaf7', border: '1px solid #eadfce', padding: '6px 10px', fontSize: 11, fontWeight: 700, color: '#6f665f' }}>
                Generated by: Admin
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right', minWidth: 210 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#1f1a17' }}>Generated Date &amp; Time</div>
            <div style={{ marginTop: 6, fontSize: 12, color: '#6f665f', lineHeight: 1.5 }}>{generatedAt}</div>
            <div style={{ marginTop: 12, display: 'inline-block', borderRadius: 999, background: '#f7efe3', padding: '6px 10px', fontSize: 11, fontWeight: 800, color: '#8b5e3c' }}>
              Executive Business Report
            </div>
          </div>
        </header>

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>{children}</main>

        <footer style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, borderTop: '1px solid #eadfce', paddingTop: 12, fontSize: 10, color: '#6f665f' }}>
          <span style={{ fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Confidential Business Report</span>
          <span style={{ fontWeight: 700 }}>Generated by Junaid Furniture Admin</span>
          <span style={{ fontWeight: 700 }}>Page {pageNumber} of {totalPages}</span>
        </footer>
      </div>
    </div>
  );
}

function ReportPdfMetric({ label, value, icon: Icon, accent }) {
  return (
    <div
      className="pdf-report-section"
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 22,
        border: '1px solid #f2e6db',
        background: '#ffffff',
        padding: 16,
        breakInside: 'avoid',
        pageBreakInside: 'avoid',
      }}
    >
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#6f665f' }}>{label}</div>
          <div style={{ marginTop: 12, fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 30, fontWeight: 700, lineHeight: 1, color: '#1f1a17' }}>
            {value}
          </div>
        </div>
        <div style={{ display: 'flex', height: 44, width: 44, flexShrink: 0, alignItems: 'center', justifyContent: 'center', borderRadius: 16, background: accent.background, color: accent.foreground }}>
          <Icon size={20} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}

function ReportPdfSectionCard({ title, children, height = 'auto' }) {
  return (
    <section
      className="pdf-report-section"
      style={{
        borderRadius: 28,
        border: '1px solid #f2e6db',
        background: '#ffffff',
        padding: 18,
        breakInside: 'avoid',
        pageBreakInside: 'avoid',
      }}
    >
      <h2 style={{ margin: 0, fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 22, fontWeight: 700, color: '#1f1a17' }}>{title}</h2>
      <div style={{ marginTop: 14, height }}>{children}</div>
    </section>
  );
}

function PremiumReportExportDocument({ analytics, pdfMeta, reportPeriod, totalPages }) {
  const generatedAt = pdfMeta.generatedAt || new Date().toLocaleString('en-PK', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const topSellingPages = chunkArray(analytics.topSellingProducts || [], 10);
  const recentTransactionPages = chunkArray(analytics.recentTransactions || [], 10);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <ReportPdfShell
        pageNumber={1}
        totalPages={totalPages}
        title="Reports"
        subtitle="Executive performance overview with revenue, operations, and sales analytics prepared for leadership review."
        generatedAt={generatedAt}
        reportPeriod={reportPeriod}
      >
        <section className="pdf-report-section" style={{ borderRadius: 28, border: '1px solid #eadfce', background: '#ffffff', padding: 18, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 0.65fr', gap: 14, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#8b5e3c' }}>Executive Snapshot</div>
              <p style={{ margin: '10px 0 0', fontSize: 12.5, lineHeight: 1.7, color: '#6f665f' }}>
                A concise, client-ready summary of the reporting period highlighting financial scale, order flow, customer base, catalog size, and inventory risk.
              </p>
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              <div style={{ borderRadius: 18, background: '#f7efe3', padding: '10px 12px' }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6f665f' }}>Total Revenue</div>
                <div style={{ marginTop: 6, fontSize: 17, fontWeight: 700, color: '#1f1a17' }}>{currency(analytics.summary?.totalRevenue)}</div>
              </div>
              <div style={{ borderRadius: 18, background: '#fcfaf7', border: '1px solid #eadfce', padding: '10px 12px' }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6f665f' }}>Total Orders</div>
                <div style={{ marginTop: 6, fontSize: 17, fontWeight: 700, color: '#1f1a17' }}>{analytics.summary?.totalOrders || 0}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="pdf-report-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
          {[
            { label: 'Total Revenue', value: currency(analytics.summary?.totalRevenue), icon: TrendingUp, accent: { background: '#f7efe3', foreground: '#8b5e3c' } },
            { label: 'Total Orders', value: analytics.summary?.totalOrders || 0, icon: ClipboardList, accent: { background: '#fff4d8', foreground: '#a86c20' } },
            { label: 'Total Customers', value: analytics.summary?.totalCustomers || 0, icon: Users2, accent: { background: '#e9f6ff', foreground: '#3182ce' } },
            { label: 'Total Products', value: analytics.summary?.totalProducts || 0, icon: Boxes, accent: { background: '#f3efe9', foreground: '#7a6654' } },
            { label: 'Average Order Value', value: currency(analytics.salesOverview?.averageOrderValue), icon: ReceiptText, accent: { background: '#f7efe3', foreground: '#8b5e3c' } },
            { label: 'Low Stock Products', value: analytics.summary?.lowStockProducts || 0, icon: TriangleAlert, accent: { background: '#feeceb', foreground: '#c53030' } },
          ].map((item) => (
            <ReportPdfMetric key={item.label} {...item} />
          ))}
        </section>
      </ReportPdfShell>

      <ReportPdfShell pageNumber={2} totalPages={totalPages} title="Reports" subtitle="Executive performance overview with revenue, operations, and sales analytics prepared for leadership review." generatedAt={generatedAt} reportPeriod={reportPeriod}>
        <ReportPdfSectionCard title="Revenue and Analytics Charts">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
            <div style={{ borderRadius: 24, border: '1px solid #f2e6db', background: '#ffffff', padding: 14, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1f1a17' }}>Revenue by Category</div>
              <div style={{ marginTop: 8, height: 238 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={analytics.categoryRevenue || []} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={74} fill="#8884d8" dataKey="revenue">
                      {(analytics.categoryRevenue || []).map((entry, index) => (
                        <Cell key={`pdf-pie-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value) => currency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ borderRadius: 24, border: '1px solid #f2e6db', background: '#ffffff', padding: 14, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1f1a17' }}>Monthly Revenue</div>
              <div style={{ marginTop: 8, height: 238 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.monthlyRevenue || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#efe7df" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" tickFormatter={(value) => `PKR ${(value / 1000).toFixed(0)}k`} />
                    <RechartsTooltip formatter={(value) => currency(value)} />
                    <Line type="monotone" dataKey="revenue" stroke="#8b5e3c" strokeWidth={2.5} dot={{ fill: '#8b5e3c', r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 14, borderRadius: 24, border: '1px solid #f2e6db', background: '#ffffff', padding: 14, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1f1a17' }}>Category Performance</div>
            <div style={{ marginTop: 8, height: 252 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.categoryPerformance || []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#efe7df" />
                  <XAxis type="number" stroke="#666" tickFormatter={(value) => `PKR ${(value / 1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="name" width={120} stroke="#666" />
                  <RechartsTooltip formatter={(value) => currency(value)} />
                  <Bar dataKey="revenue" fill="#8b5e3c" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ReportPdfSectionCard>
      </ReportPdfShell>

      {topSellingPages.map((rows, index) => (
        <ReportPdfShell key={`top-products-${index}`} pageNumber={3 + index} totalPages={totalPages} title="Reports" subtitle="Executive performance overview with revenue, operations, and sales analytics prepared for leadership review." generatedAt={generatedAt} reportPeriod={reportPeriod}>
          <ReportPdfSectionCard title={`Top Selling Products${index > 0 ? ' (Continued)' : ''}`}>
            <div style={{ borderRadius: 22, border: '1px solid #eadfce', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#fcfaf7' }}>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6f665f' }}>Product</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right', fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6f665f' }}>Units</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right', fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6f665f' }}>Revenue</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right', fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6f665f' }}>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((product) => (
                    <tr key={product.productId} style={{ borderTop: '1px solid #f4ece3' }}>
                      <td style={{ padding: '11px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: 10, background: '#f7efe3', border: '1px solid #eadfce', overflow: 'hidden', flexShrink: 0 }}>
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                loading="lazy"
                                decoding="async"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : null}
                          </div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#1f1a17' }}>{product.name}</div>
                        </div>
                      </td>
                      <td style={{ padding: '11px 14px', textAlign: 'right', fontSize: 12, color: '#1f1a17' }}>{product.unitsSold}</td>
                      <td style={{ padding: '11px 14px', textAlign: 'right', fontSize: 12, fontWeight: 700, color: '#1f1a17' }}>{currency(product.revenue)}</td>
                      <td style={{ padding: '11px 14px', textAlign: 'right', fontSize: 12, color: '#1f1a17' }}>{product.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ReportPdfSectionCard>
        </ReportPdfShell>
      ))}

      {recentTransactionPages.map((rows, index) => (
        <ReportPdfShell key={`transactions-${index}`} pageNumber={3 + topSellingPages.length + index} totalPages={totalPages} title="Reports" subtitle="Executive performance overview with revenue, operations, and sales analytics prepared for leadership review." generatedAt={generatedAt} reportPeriod={reportPeriod}>
          <ReportPdfSectionCard title={`Recent Transactions${index > 0 ? ' (Continued)' : ''}`}>
            <div style={{ borderRadius: 22, border: '1px solid #eadfce', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#fcfaf7' }}>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6f665f' }}>Customer</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6f665f' }}>Order ID</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right', fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6f665f' }}>Amount</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center', fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6f665f' }}>Status</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right', fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6f665f' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((transaction) => (
                    <tr key={transaction.id} style={{ borderTop: '1px solid #f4ece3' }}>
                      <td style={{ padding: '11px 14px', fontSize: 12, color: '#1f1a17' }}>{transaction.customer}</td>
                      <td style={{ padding: '11px 14px', fontSize: 12, fontWeight: 600, color: '#1f1a17' }}>{transaction.orderId}</td>
                      <td style={{ padding: '11px 14px', textAlign: 'right', fontSize: 12, fontWeight: 700, color: '#1f1a17' }}>{currency(transaction.amount)}</td>
                      <td style={{ padding: '11px 14px', textAlign: 'center' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 999, padding: '5px 10px', fontSize: 11, fontWeight: 700, background: transaction.status === 'Completed' ? '#dcfce7' : transaction.status === 'Pending' ? '#fef3c7' : transaction.status === 'Cancelled' ? '#fee2e2' : '#f3f4f6', color: transaction.status === 'Completed' ? '#15803d' : transaction.status === 'Pending' ? '#a16207' : transaction.status === 'Cancelled' ? '#b91c1c' : '#4b5563' }}>
                          {transaction.status}
                        </span>
                      </td>
                      <td style={{ padding: '11px 14px', textAlign: 'right', fontSize: 12, color: '#6f665f' }}>{formatDateTime(transaction.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ReportPdfSectionCard>
        </ReportPdfShell>
      ))}

      <ReportPdfShell pageNumber={3 + topSellingPages.length + recentTransactionPages.length} totalPages={totalPages} title="Reports" subtitle="Executive performance overview with revenue, operations, and sales analytics prepared for leadership review." generatedAt={generatedAt} reportPeriod={reportPeriod}>
        <ReportPdfSectionCard title="Sales Overview">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
            {[
              { label: 'Average Order Value', value: currency(analytics.salesOverview?.averageOrderValue) },
              { label: 'Best Selling Day', value: analytics.salesOverview?.bestSellingDay || 'N/A' },
              { label: 'Best Selling Month', value: analytics.salesOverview?.bestSellingMonth || 'N/A' },
              { label: 'Best Selling Category', value: analytics.salesOverview?.bestSellingCategory || 'N/A' },
              { label: 'Total Discount Given', value: currency(analytics.salesOverview?.totalDiscount) },
            ].map((item) => (
              <div key={item.label} style={{ borderRadius: 20, background: '#f7efe3', padding: 16, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6f665f' }}>{item.label}</div>
                <div style={{ marginTop: 10, fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 22, fontWeight: 700, color: '#1f1a17', lineHeight: 1.15 }}>{item.value}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, borderRadius: 22, border: '1px solid #eadfce', background: '#ffffff', padding: 16, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1f1a17' }}>Business Notes</div>
            <p style={{ margin: '10px 0 0', fontSize: 12.5, lineHeight: 1.7, color: '#6f665f' }}>
              This summary consolidates sales cadence, product velocity, and inventory pressure into a board-ready snapshot for executive meetings, client presentations, and operational planning.
            </p>
          </div>
        </ReportPdfSectionCard>
      </ReportPdfShell>
    </div>
  );
}

function KpiCard({ label, value, icon: Icon, note, accent, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-3xl border border-[#f2e6db]/80 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
      style={{ minHeight: 164 }}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#fcfaf7] transition-colors duration-300 group-hover:bg-[#f7efe3]" />
      <div className="pointer-events-none absolute -left-6 bottom-0 h-20 w-20 rounded-full bg-[#faf3ea] opacity-60 blur-xl" />

      <div className="relative z-10 flex h-full flex-col justify-between gap-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-text/45">{label}</p>
            <p className="mt-3 font-display text-[clamp(1.8rem,3vw,2.65rem)] font-semibold leading-none tracking-tight text-text">
              {value}
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f7efe3] text-primary shadow-sm transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
            <Icon size={20} strokeWidth={2} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-[#f2e6db] to-transparent" />
          <span className={`rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide ${accent}`}>
            {note}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminReportsPage() {
  const { auth } = useApp();
  const pdfExportRef = useRef(null);
  const [summary, setSummary] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [pdfMeta, setPdfMeta] = useState({ generatedAt: '', generatedBy: 'Admin' });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const [summaryData, revenueData, ordersData, productsData] = await Promise.all([
          adminApi.summary(auth.token),
          adminApi.revenue(auth.token),
          adminApi.orders(auth.token),
          adminApi.products(auth.token, { limit: 200 }),
        ]);
        setSummary(summaryData);
        setRevenue(revenueData || []);
        setOrders(ordersData || []);
        setProducts(productsData?.products || []);
      } catch (err) {
        setError(err.message || 'Unable to load reports');
      } finally {
        setLoading(false);
      }
    };

    if (auth?.token) load();
  }, [auth?.token]);

  const analytics = useMemo(() => {
    if (!summary || !orders.length) return null;

    const productSales = {};
    orders.forEach(order => {
      (order.orderItems || []).forEach(item => {
        const productId = item.product?._id || item.product;
        if (!productSales[productId]) {
          productSales[productId] = {
            productId,
            name: item.name,
            image: item.image || item.product?.images?.[0] || '',
            unitsSold: 0,
            revenue: 0,
          };
        }
        productSales[productId].unitsSold += item.qty || 1;
        productSales[productId].revenue += (item.price || 0) * (item.qty || 1);
      });
    });

    const topSellingProducts = Object.values(productSales)
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 10)
      .map(product => ({
        ...product,
        stock: products.find(p => p._id === product.productId)?.stock || 0,
      }));

    const categoryRevenue = {};
    orders.forEach(order => {
      (order.orderItems || []).forEach(item => {
        const categoryName = item.product?.category?.name || 'Uncategorized';
        if (!categoryRevenue[categoryName]) {
          categoryRevenue[categoryName] = 0;
        }
        categoryRevenue[categoryName] += (item.price || 0) * (item.qty || 1);
      });
    });

    const categoryPerformance = Object.entries(categoryRevenue)
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue);

    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const lowStockProducts = products.filter(product => (product.stock ?? 0) <= 5).length;

    const daySales = {};
    orders.forEach(order => {
      if (order.createdAt) {
        const day = new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'long' });
        if (!daySales[day]) daySales[day] = 0;
        daySales[day] += order.totalPrice || 0;
      }
    });
    const bestSellingDay = Object.entries(daySales).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    const monthSales = {};
    orders.forEach(order => {
      if (order.createdAt) {
        const month = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        if (!monthSales[month]) monthSales[month] = 0;
        monthSales[month] += order.totalPrice || 0;
      }
    });
    const bestSellingMonth = Object.entries(monthSales).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    const bestSellingCategory = categoryPerformance[0]?.name || 'N/A';

    let totalDiscount = 0;
    orders.forEach(order => {
      (order.orderItems || []).forEach(item => {
        const product = products.find(p => p._id === (item.product?._id || item.product));
        if (product && product.discountPrice && product.discountPrice < product.price) {
          const discountPerUnit = product.price - product.discountPrice;
          totalDiscount += discountPerUnit * (item.qty || 1);
        }
      });
    });

    const recentTransactions = orders.slice(0, 20).map(order => ({
      id: order._id,
      customer: order.user?.name || order.shippingAddress?.fullName || 'Guest',
      orderId: order._id?.toString().slice(-8).toUpperCase() || 'N/A',
      amount: order.totalPrice || 0,
      status: order.status || 'Pending',
      date: order.createdAt,
    }));

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyChart = revenue.map(item => ({
      month: monthNames[item.month - 1],
      year: item.year,
      revenue: item.revenue,
    }));

    return {
      summary: {
        totalRevenue: summary.revenue || 0,
        totalOrders: summary.orders || 0,
        totalCustomers: summary.customers || 0,
        totalProducts: summary.products || 0,
        lowStockProducts,
      },
      topSellingProducts,
      recentTransactions,
      categoryPerformance,
      salesOverview: {
        averageOrderValue,
        bestSellingDay,
        bestSellingMonth,
        bestSellingCategory,
        totalDiscount,
      },
      monthlyRevenue: monthlyChart,
      categoryRevenue: categoryPerformance,
    };
  }, [summary, orders, products, revenue]);

  const reportPeriod = useMemo(() => formatReportPeriod(revenue), [revenue]);
  const topSellingPages = useMemo(() => chunkArray(analytics?.topSellingProducts || [], 10), [analytics]);
  const recentTransactionPages = useMemo(() => chunkArray(analytics?.recentTransactions || [], 10), [analytics]);
  const totalPdfPages = analytics ? 3 + topSellingPages.length + recentTransactionPages.length : 0;

  const handleExportPdf = async () => {
    if (!analytics || !pdfExportRef.current || exportingPdf) return;

    try {
      setExportingPdf(true);
      setPdfMeta({
        generatedAt: new Date().toLocaleString('en-PK', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        generatedBy: 'Admin',
      });

      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfPages = Array.from(pdfExportRef.current.querySelectorAll('[data-pdf-page]'));

      if (!pdfPages.length) {
        throw new Error('Report pages were not rendered for export');
      }

      for (let index = 0; index < pdfPages.length; index += 1) {
        const page = pdfPages[index];
        const canvas = await html2canvas(page, {
          backgroundColor: '#ffffff',
          scale: Math.min(2, window.devicePixelRatio || 1),
          useCORS: true,
          logging: false,
        });
        const imageData = canvas.toDataURL('image/png');

        if (index > 0) {
          pdf.addPage();
        }

        pdf.addImage(imageData, 'PNG', 0, 0, PDF_A4_WIDTH_MM, PDF_A4_HEIGHT_MM, undefined, 'FAST');
      }

      pdf.save(`junaid-furniture-reports-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('Failed to export PDF', err);
      setError('Unable to export the report as PDF. Please try again.');
    } finally {
      setExportingPdf(false);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      case 'Refunded': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <AdminPageShell title="Reports" description="Analyze sales performance with revenue and operational summaries.">
      {error ? <div className="mb-4 rounded-3xl bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div> : null}
      {loading ? <div className="rounded-3xl bg-white p-6 shadow-card">Loading reports...</div> : null}

      {analytics && (
        <>
          <div className="mb-6 flex flex-wrap items-center justify-end gap-2 print:hidden">
            <button
              onClick={handleExportPdf}
              disabled={exportingPdf}
              className="inline-flex items-center gap-2 rounded-full border border-[#e8dccf] bg-white px-4 py-2 text-sm font-semibold text-text/70 shadow-[0_4px_16px_-8px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:border-[#d7c2ac] hover:text-primary disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              <Download size={14} />
              {exportingPdf ? 'Exporting PDF...' : 'Export PDF'}
            </button>
            <button
              onClick={handlePrintReport}
              className="inline-flex items-center gap-2 rounded-full border border-[#e8dccf] bg-white px-4 py-2 text-sm font-semibold text-text/70 shadow-[0_4px_16px_-8px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:border-[#d7c2ac] hover:text-primary"
            >
              <Printer size={14} />
              Print Report
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              { label: 'Total Revenue', value: currency(analytics.summary?.totalRevenue), icon: TrendingUp, note: 'Sales performance', accent: 'bg-emerald-50 text-emerald-700' },
              { label: 'Total Orders', value: analytics.summary?.totalOrders || 0, icon: ClipboardList, note: 'Processed orders', accent: 'bg-amber-50 text-amber-700' },
              { label: 'Total Customers', value: analytics.summary?.totalCustomers || 0, icon: Users2, note: 'Registered buyers', accent: 'bg-sky-50 text-sky-700' },
              { label: 'Total Products', value: analytics.summary?.totalProducts || 0, icon: Boxes, note: 'Active catalog', accent: 'bg-stone-100 text-stone-700' },
              { label: 'Average Order Value', value: currency(analytics.salesOverview?.averageOrderValue), icon: ReceiptText, note: 'Per order average', accent: 'bg-[#f7efe3] text-primary' },
              { label: 'Low Stock Products', value: analytics.summary?.lowStockProducts || 0, icon: TriangleAlert, note: 'Inventory watch', accent: 'bg-red-50 text-red-700' },
            ].map((card, index) => (
              <KpiCard key={card.label} {...card} index={index} />
            ))}
          </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-[#f2e6db]/70 bg-white p-6 shadow-card">
                <h3 className="font-display text-2xl font-semibold text-text">Revenue by Category</h3>
                <div className="mt-4 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.categoryRevenue || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="revenue"
                      >
                        {(analytics.categoryRevenue || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(value) => currency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-3xl border border-[#f2e6db]/70 bg-white p-6 shadow-card">
                <h3 className="font-display text-2xl font-semibold text-text">Monthly Revenue</h3>
                <div className="mt-4 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.monthlyRevenue || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#666" />
                      <YAxis stroke="#666" tickFormatter={(value) => `PKR ${(value / 1000).toFixed(0)}k`} />
                      <RechartsTooltip formatter={(value) => currency(value)} />
                      <Line type="monotone" dataKey="revenue" stroke="#8b5e3c" strokeWidth={2} dot={{ fill: '#8b5e3c' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-[#f2e6db]/70 bg-white p-6 shadow-card">
              <h3 className="font-display text-2xl font-semibold text-text">Category Performance</h3>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.categoryPerformance || []} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" stroke="#666" tickFormatter={(value) => `PKR ${(value / 1000).toFixed(0)}k`} />
                    <YAxis type="category" dataKey="name" width={100} stroke="#666" />
                    <RechartsTooltip formatter={(value) => currency(value)} />
                    <Bar dataKey="revenue" fill="#8b5e3c" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-[#f2e6db]/70 bg-white p-6 shadow-card">
                <h3 className="font-display text-2xl font-semibold text-text">Top Selling Products</h3>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-black/10">
                        <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-text/60">Product</th>
                        <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-text/60">Units</th>
                        <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-text/60">Revenue</th>
                        <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-text/60">Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(analytics.topSellingProducts || []).map((product) => (
                        <tr key={product.productId} className="border-b border-black/5">
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image}
                                alt={product.name}
                                loading="lazy"
                                decoding="async"
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                              <span className="text-sm font-medium text-text">{product.name}</span>
                            </div>
                          </td>
                          <td className="py-3 text-right text-sm text-text">{product.unitsSold}</td>
                          <td className="py-3 text-right text-sm font-semibold text-text">{currency(product.revenue)}</td>
                          <td className="py-3 text-right text-sm text-text">{product.stock}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-3xl border border-[#f2e6db]/70 bg-white p-6 shadow-card">
                <h3 className="font-display text-2xl font-semibold text-text">Recent Transactions</h3>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-black/10">
                        <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-text/60">Customer</th>
                        <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-text/60">Order ID</th>
                        <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-text/60">Amount</th>
                        <th className="pb-3 text-center text-xs font-semibold uppercase tracking-wider text-text/60">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(analytics.recentTransactions || []).map((transaction) => (
                        <tr key={transaction.id} className="border-b border-black/5">
                          <td className="py-3 text-sm text-text">{transaction.customer}</td>
                          <td className="py-3 text-sm font-medium text-text">{transaction.orderId}</td>
                          <td className="py-3 text-right text-sm font-semibold text-text">{currency(transaction.amount)}</td>
                          <td className="py-3 text-center">
                            <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(transaction.status)}`}>
                              {transaction.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-[#f2e6db]/70 bg-white p-6 shadow-card">
              <h3 className="font-display text-2xl font-semibold text-text">Sales Overview</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: 'Average Order Value', value: currency(analytics.salesOverview?.averageOrderValue) },
                  { label: 'Best Selling Day', value: analytics.salesOverview?.bestSellingDay },
                  { label: 'Best Selling Month', value: analytics.salesOverview?.bestSellingMonth },
                  { label: 'Best Selling Category', value: analytics.salesOverview?.bestSellingCategory },
                  { label: 'Total Discount Given', value: currency(analytics.salesOverview?.totalDiscount) },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl bg-[#f7efe3] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-text/60">{item.label}</p>
                    <p className="mt-2 text-lg font-semibold text-text">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            ref={pdfExportRef}
            aria-hidden="true"
            className="pointer-events-none fixed left-[-10000px] top-0 -z-10"
            style={{ width: `${PDF_PAGE_WIDTH}px` }}
          >
            <PremiumReportExportDocument
              analytics={analytics}
              pdfMeta={pdfMeta}
              reportPeriod={reportPeriod}
              totalPages={totalPdfPages}
            />
          </div>
        </>
      )}
    </AdminPageShell>
  );
}
