// This dashboard is 100% Firestore-driven. All data shown is from the Firestore 'sales' collection.
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

interface Sale {
  id: string;
  program: string;
  saleAmount: number;
  commission: number;
  saleDate: string;
  customerName: string;
  customerEmail: string;
  status: string;
  reference: string;
  notes: string;
  createdAt: any;
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const SalesDashboard = () => {
  const navigate = useNavigate();
  const [sales, setSales] = useState<Sale[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Sale[]>([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);
  const [salesChange, setSalesChange] = useState(0);
  const [commissionChange, setCommissionChange] = useState(0);
  const [conversionChange, setConversionChange] = useState(0);
  const [chartData, setChartData] = useState<number[]>([]);

  useEffect(() => {
    const qSales = query(collection(db, "sales"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(qSales, (snap) => {
      const allSales = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Sale));
      setSales(allSales);
      setRecentTransactions(allSales.slice(0, 5));

      // Stats: This month
      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();
      const salesThisMonth = allSales.filter(s => {
        const d = new Date(s.saleDate);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
      });
      const totalSalesVal = salesThisMonth.reduce((sum, s) => sum + Number(s.saleAmount), 0);
      setTotalSales(totalSalesVal);
      const totalCommissionVal = salesThisMonth.reduce((sum, s) => sum + Number(s.commission), 0);
      setTotalCommission(totalCommissionVal);
      // Conversion rate: dummy logic (could be improved if you have leads data)
      setConversionRate(salesThisMonth.length ? Math.min(100, (salesThisMonth.length / 100) * 100) : 0);

      // Change vs last month
      const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
      const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
      const salesLastMonth = allSales.filter(s => {
        const d = new Date(s.saleDate);
        return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
      });
      const totalSalesLastMonth = salesLastMonth.reduce((sum, s) => sum + Number(s.saleAmount), 0);
      const totalCommissionLastMonth = salesLastMonth.reduce((sum, s) => sum + Number(s.commission), 0);
      setSalesChange(totalSalesLastMonth ? Math.round(((totalSalesVal - totalSalesLastMonth) / totalSalesLastMonth) * 100) : 0);
      setCommissionChange(totalCommissionLastMonth ? Math.round(((totalCommissionVal - totalCommissionLastMonth) / totalCommissionLastMonth) * 100) : 0);
      setConversionChange(salesLastMonth.length ? Math.round(((salesThisMonth.length - salesLastMonth.length) / salesLastMonth.length) * 100) : 0);

      // Chart Data: sales per month for current year
      const salesByMonth = Array(12).fill(0);
      allSales.forEach(s => {
        const d = new Date(s.saleDate);
        if (d.getFullYear() === thisYear) {
          salesByMonth[d.getMonth()] += Number(s.saleAmount);
        }
      });
      setChartData(salesByMonth);
    });
    return () => unsub();
  }, []);

  return (
    <div className="pt-8 min-h-screen bg-gray-50 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold">Sales & Commissions</h1>
          <div className="flex gap-2">
            <input type="text" className="border rounded px-3 py-2" value="This month" readOnly style={{width:120}} />
            <Button variant="outline">Filter</Button>
            <Button variant="outline">Export</Button>
            <Button className="bg-affiliate-purple hover:bg-affiliate-purple/90" onClick={() => navigate("/sales-manager")}>Add Sale</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6 flex flex-col relative">
            <div className="text-gray-500 text-sm mb-1">Total Sales</div>
            <div className="text-3xl font-bold">{totalSales}</div>
            <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
              <span>&uarr; {salesChange}%</span>
            </div>
            <Button size="sm" variant="ghost" className="absolute top-3 right-3 text-xs underline" onClick={() => navigate('/sales-manager')}>Go to Sales Manager</Button>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col relative">
            <div className="text-gray-500 text-sm mb-1">Commission Earned</div>
            <div className="text-3xl font-bold">${totalCommission.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
              <span>&uarr; {commissionChange}%</span>
            </div>
            <Button size="sm" variant="ghost" className="absolute top-3 right-3 text-xs underline" onClick={() => navigate('/sales-manager')}>Go to Sales Manager</Button>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col relative">
            <div className="text-gray-500 text-sm mb-1">Conversion Rate</div>
            <div className="text-3xl font-bold">{conversionRate}%</div>
            <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
              <span>&uarr; {conversionChange}%</span>
            </div>
            <Button size="sm" variant="ghost" className="absolute top-3 right-3 text-xs underline" onClick={() => navigate('/sales-manager')}>Go to Sales Manager</Button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="font-semibold mb-4">Sales Performance</div>
          {sales.length === 0 ? (
            <div className="text-gray-400 text-center py-16">No sales data available for chart.</div>
          ) : (
            <div className="flex items-end gap-6 h-56">
              {months.map((month, i) => (
                <div key={month} className="flex flex-col items-center justify-end" style={{height:'100%'}}>
                  <div style={{height: chartData[i]/40, width: 40, background: '#7C3AED', borderRadius: 8}}></div>
                  <div className="mt-2 text-sm text-gray-600">{month}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="font-semibold">Recent Transactions</div>
            <Button size="sm" variant="outline" onClick={() => navigate('/sales-manager')}>View All Sales</Button>
          </div>
          {recentTransactions.length === 0 ? (
            <div className="text-gray-400 text-center py-12">No transactions found.</div>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-2">DATE</th>
                  <th className="p-2">PROGRAM</th>
                  <th className="p-2">AMOUNT</th>
                  <th className="p-2">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx, idx) => (
                  <tr key={tx.id || idx} className="border-b">
                    <td className="p-2">{tx.saleDate ? new Date(tx.saleDate).toLocaleDateString() : ""}</td>
                    <td className="p-2">{tx.program}</td>
                    <td className="p-2">${Number(tx.saleAmount).toFixed(2)}</td>
                    <td className="p-2">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">{tx.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
