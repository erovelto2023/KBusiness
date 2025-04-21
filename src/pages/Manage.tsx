
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";

const Manage = () => {
  const { toast } = useToast();
  // Platforms
  const [platforms, setPlatforms] = useState<{ id: string; name: string; website: string }[]>([]);
  const [newPlatform, setNewPlatform] = useState({ name: "", website: "" });
  // Categories
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [newCategory, setNewCategory] = useState({ name: "" });

  // Fetch platforms
  const fetchPlatforms = async () => {
    const q = query(collection(db, "platforms"), orderBy("name"));
    const snap = await getDocs(q);
    setPlatforms(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as any)));
  };
  // Fetch categories
  const fetchCategories = async () => {
    const q = query(collection(db, "categories"), orderBy("name"));
    const snap = await getDocs(q);
    setCategories(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as any)));
  };
  useEffect(() => {
    fetchPlatforms();
    fetchCategories();
  }, []);

  // Add platform
  const handleAddPlatform = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlatform.name) return;
    await addDoc(collection(db, "platforms"), newPlatform);
    setNewPlatform({ name: "", website: "" });
    fetchPlatforms();
    toast({ title: "Platform Added", description: "New platform has been added successfully" });
  };
  // Add category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name) return;
    await addDoc(collection(db, "categories"), newCategory);
    setNewCategory({ name: "" });
    fetchCategories();
    toast({ title: "Category Added", description: "New category has been added successfully" });
  };
  // Delete platform
  const handleDeletePlatform = async (id: string) => {
    await deleteDoc(doc(db, "platforms", id));
    fetchPlatforms();
  };
  // Delete category
  const handleDeleteCategory = async (id: string) => {
    await deleteDoc(doc(db, "categories", id));
    fetchCategories();
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-50 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Manage</h1>
          <p className="text-gray-600 mt-2">Configure your affiliate programs and settings</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle>Add Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleAddPlatform}>
                <div className="space-y-2">
                  <label htmlFor="platform-name" className="text-sm font-medium text-gray-700">Platform Name</label>
                  <Input id="platform-name" placeholder="Enter platform name" value={newPlatform.name} onChange={e => setNewPlatform({ ...newPlatform, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="website" className="text-sm font-medium text-gray-700">Website</label>
                  <Input id="website" placeholder="https://" value={newPlatform.website} onChange={e => setNewPlatform({ ...newPlatform, website: e.target.value })} />
                </div>
                <Button type="submit" className="w-full md:w-auto bg-affiliate-purple hover:bg-affiliate-purple/90 mt-2">
                  Add
                </Button>
              </form>
              {/* List Platforms */}
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Existing Platforms</h4>
                <ul className="space-y-2">
                  {platforms.map((p) => (
                    <li key={p.id} className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded">
                      <span>{p.name} {p.website && <a href={p.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs ml-2">{p.website}</a>}</span>
                      <Button size="sm" variant="outline" onClick={() => handleDeletePlatform(p.id)}>Delete</Button>
                    </li>
                  ))}
                  {platforms.length === 0 && <li className="text-xs text-gray-400">No platforms yet.</li>}
                </ul>
              </div>
            </CardContent>
          </Card>
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle>Add Category</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleAddCategory}>
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium text-gray-700">Category</label>
                  <Input id="category" placeholder="Enter category name" value={newCategory.name} onChange={e => setNewCategory({ name: e.target.value })} required />
                </div>
                <Button type="submit" className="w-full md:w-auto bg-affiliate-purple hover:bg-affiliate-purple/90 mt-2">
                  Add
                </Button>
              </form>
              {/* List Categories */}
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Existing Categories</h4>
                <ul className="space-y-2">
                  {categories.map((c) => (
                    <li key={c.id} className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded">
                      <span>{c.name}</span>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteCategory(c.id)}>Delete</Button>
                    </li>
                  ))}
                  {categories.length === 0 && <li className="text-xs text-gray-400">No categories yet.</li>}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
                  <Input id="name" placeholder="John Doe" />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                  <Input id="email" placeholder="john@example.com" />
                </div>
                
                <Button className="w-full md:w-auto bg-affiliate-purple hover:bg-affiliate-purple/90">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="payment-method" className="text-sm font-medium text-gray-700">Payment Method</label>
                  <select 
                    id="payment-method" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-affiliate-purple/50 focus:border-affiliate-purple/50"
                  >
                    <option>PayPal</option>
                    <option>Bank Transfer</option>
                    <option>Stripe</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="payment-email" className="text-sm font-medium text-gray-700">Payment Email</label>
                  <Input id="payment-email" placeholder="payments@example.com" />
                </div>
                
                <Button className="w-full md:w-auto bg-affiliate-purple hover:bg-affiliate-purple/90">
                  Save Payment Info
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-affiliate-purple/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-affiliate-purple"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">SMS Notifications</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-affiliate-purple/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-affiliate-purple"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Sales Alerts</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-affiliate-purple/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-affiliate-purple"></div>
                  </label>
                </div>
                
                <Button className="w-full md:w-auto bg-affiliate-purple hover:bg-affiliate-purple/90">
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Manage;
