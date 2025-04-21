import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

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

const programOptions = ["Program A", "Program B", "Program C"];
const statusOptions = ["Pending", "Paid", "Rejected"];

const SalesManager = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [form, setForm] = useState<Omit<Sale, "id" | "createdAt">>({
    program: "",
    saleAmount: 0,
    commission: 0,
    saleDate: new Date().toISOString().slice(0, 10),
    customerName: "",
    customerEmail: "",
    status: "Pending",
    reference: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"record" | "history">("record");
  const [filter, setFilter] = useState({ start: "", end: "" });

  useEffect(() => {
    const qSales = query(collection(db, "sales"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(qSales, (snap) => {
      setSales(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Sale)));
    });
    return () => unsub();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "sales"), {
        ...form,
        saleAmount: Number(form.saleAmount),
        commission: Number(form.commission),
        createdAt: serverTimestamp(),
      });
      setForm({
        program: "",
        saleAmount: 0,
        commission: 0,
        saleDate: new Date().toISOString().slice(0, 10),
        customerName: "",
        customerEmail: "",
        status: "Pending",
        reference: "",
        notes: ""
      });
    } catch {
      alert("Failed to record sale");
    }
    setLoading(false);
  };

  // Filtered sales for history tab
  const filteredSales = sales.filter((sale) => {
    const saleDate = sale.saleDate;
    const { start, end } = filter;
    if (start && saleDate < start) return false;
    if (end && saleDate > end) return false;
    return true;
  });

  const totalSales = filteredSales.reduce((sum, s) => sum + Number(s.saleAmount), 0);
  const totalCommission = filteredSales.reduce((sum, s) => sum + Number(s.commission), 0);

  return (
    <div className="pt-6 min-h-screen bg-gray-50 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-1">Sales Manager</h1>
        <div className="text-gray-600 mb-6">Record and track your affiliate sales</div>
        <div className="flex gap-8 border-b mb-6">
          <button className={`pb-2 px-2 border-b-2 ${tab === "record" ? "border-purple-600 text-purple-700 font-medium" : "border-transparent text-gray-500"}`} onClick={() => setTab("record")}>Record Sale</button>
          <button className={`pb-2 px-2 border-b-2 ${tab === "history" ? "border-purple-600 text-purple-700 font-medium" : "border-transparent text-gray-500"}`} onClick={() => setTab("history")}>Sales History</button>
        </div>
        {tab === "record" && (
          <form className="bg-white rounded-lg shadow p-6 mb-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium mb-1">Program</label>
                <select name="program" value={form.program} onChange={handleChange} required className="w-full border rounded px-3 py-2">
                  <option value="">Select Program</option>
                  {programOptions.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">Sale Amount ($)</label>
                <Input name="saleAmount" type="number" min="0" value={form.saleAmount} onChange={handleChange} required />
              </div>
              <div>
                <label className="block font-medium mb-1">Commission Earned ($)</label>
                <Input name="commission" type="number" min="0" value={form.commission} onChange={handleChange} required />
              </div>
              <div>
                <label className="block font-medium mb-1">Sale Date</label>
                <Input name="saleDate" type="date" value={form.saleDate} onChange={handleChange} required />
              </div>
              <div>
                <label className="block font-medium mb-1">Customer Name</label>
                <Input name="customerName" value={form.customerName} onChange={handleChange} />
              </div>
              <div>
                <label className="block font-medium mb-1">Customer Email</label>
                <Input name="customerEmail" value={form.customerEmail} onChange={handleChange} />
              </div>
              <div>
                <label className="block font-medium mb-1">Status</label>
                <select name="status" value={form.status} onChange={handleChange} required className="w-full border rounded px-3 py-2">
                  {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">Reference ID</label>
                <Input name="reference" value={form.reference} onChange={handleChange} placeholder="Order ID, Transaction ID, etc." />
              </div>
            </div>
            <div className="mt-4">
              <label className="block font-medium mb-1">Notes</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2 text-base min-h-[60px]" placeholder="Additional notes about the sale..." />
            </div>
            <div className="flex justify-end mt-6">
              <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Record Sale"}</Button>
            </div>
          </form>
        )}
        {tab === "history" && (
          <div>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <Input type="date" value={filter.start} onChange={e => setFilter(f => ({ ...f, start: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <Input type="date" value={filter.end} onChange={e => setFilter(f => ({ ...f, end: e.target.value }))} />
              </div>
              <div className="flex-1 flex items-end justify-end">
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => alert('Export CSV coming soon!')} type="button">Export CSV</Button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-gray-500 text-sm mb-1">Total Sales</div>
                <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-gray-500 text-sm mb-1">Total Commission</div>
                <div className="text-2xl font-bold text-green-600">${totalCommission.toFixed(2)}</div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg">
                <thead>
                  <tr className="text-left border-b">
                    <th className="p-2">PROGRAM</th>
                    <th className="p-2">SALE AMOUNT</th>
                    <th className="p-2">COMMISSION</th>
                    <th className="p-2">DATE</th>
                    <th className="p-2">STATUS</th>
                    <th className="p-2">REFERENCE</th>
                    <th className="p-2">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.length === 0 && (
                    <tr><td colSpan={7} className="text-gray-500 text-center py-8">No sales found.</td></tr>
                  )}
                  {filteredSales.map((sale) => (
                    <tr key={sale.id} className="border-b">
                      <td className="p-2">{sale.program}</td>
                      <td className="p-2">${Number(sale.saleAmount).toFixed(2)}</td>
                      <td className="p-2">${Number(sale.commission).toFixed(2)}</td>
                      <td className="p-2">{sale.saleDate}</td>
                      <td className="p-2">{sale.status}</td>
                      <td className="p-2">{sale.reference}</td>
                      <td className="p-2">-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesManager;
