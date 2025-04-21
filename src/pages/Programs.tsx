
import React, { useEffect, useState, useRef } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ProgramCard } from "../components/ui/program-card";
import { Search, Plus, FileUp, FileDown } from "lucide-react";
import { Program } from "../types";
import { useToast } from "../hooks/use-toast";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  writeBatch,
  deleteDoc,
  doc,
} from "firebase/firestore";

const PROGRAMS_COLLECTION = "programs";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../components/ui/select";

const Programs = () => {
  const { toast } = useToast();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProgram, setNewProgram] = useState<Omit<Program, "id">>({
    name: "",
    category: "",
    commission: "",
    platform: "",
    description: "",
    image: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Dropdown options
  const [platformOptions, setPlatformOptions] = useState<string[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [loadingPlatforms, setLoadingPlatforms] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Fetch all programs from Firestore
  const fetchPrograms = async () => {
    const q = query(collection(db, PROGRAMS_COLLECTION), orderBy("name"));
    const snapshot = await getDocs(q);
    setPrograms(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Program)));
  };
  // Fetch dropdown options
  const fetchPlatformOptions = async () => {
    setLoadingPlatforms(true);
    const snap = await getDocs(query(collection(db, "platforms"), orderBy("name")));
    setPlatformOptions(snap.docs.map((doc) => doc.data().name));
    setLoadingPlatforms(false);
  };
  const fetchCategoryOptions = async () => {
    setLoadingCategories(true);
    const snap = await getDocs(query(collection(db, "categories"), orderBy("name")));
    setCategoryOptions(snap.docs.map((doc) => doc.data().name));
    setLoadingCategories(false);
  };

  useEffect(() => {
    fetchPrograms();
  }, []);
  useEffect(() => {
    if (showAddModal) {
      fetchPlatformOptions();
      fetchCategoryOptions();
    }
  }, [showAddModal]);

  // Add new program to Firestore
  const handleAddProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgram.name || !newProgram.platform || !newProgram.category) return;
    await addDoc(collection(db, PROGRAMS_COLLECTION), newProgram);
    setShowAddModal(false);
    setNewProgram({ name: "", category: "", commission: "", platform: "", description: "", image: "" });
    fetchPrograms();
    toast({ title: "Program added", description: `${newProgram.name} added successfully!` });
  };


  // Search programs client-side
  const filteredPrograms = programs.filter((program) =>
    program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    program.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    program.platform.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Export to CSV
  const exportCSV = () => {
    if (!programs.length) return;
    const keys = Object.keys(programs[0]);
    const csv = [
      keys.join(","),
      ...programs.map((p) => keys.map((k) => (p as any)[k]).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "programs.csv";
    link.click();
  };

  // Export to JSON
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(programs, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "programs.json";
    link.click();
  };

  // Import from file
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    let imported: Omit<Program, "id">[] = [];
    if (file.name.endsWith(".json")) {
      imported = JSON.parse(text);
    } else if (file.name.endsWith(".csv")) {
      const [header, ...rows] = text.split(/\r?\n/);
      const keys = header.split(",");
      imported = rows.map((row) => {
        const values = row.split(",");
        const obj: any = {};
        keys.forEach((k, i) => (obj[k] = values[i]));
        return obj as Omit<Program, "id">;
      });
    }
    // Batch add
    await Promise.all(imported.map((program) => addDoc(collection(db, PROGRAMS_COLLECTION), program)));
    fetchPrograms();
    toast({ title: "Import complete", description: `${imported.length} programs imported.` });
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-50 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Programs</h1>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search programs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 flex items-center gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileUp className="h-4 w-4" />
                <span className="hidden sm:inline">Import</span>
              </Button>
              <input
                type="file"
                accept=".json,.csv"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImport}
              />
              <Button 
                variant="outline"
                className="flex-1 flex items-center gap-2"
                onClick={exportCSV}
                disabled={!programs.length}
              >
                <FileDown className="h-4 w-4" />
                <span className="hidden sm:inline">Export CSV</span>
              </Button>
              <Button 
                variant="outline"
                className="flex-1 flex items-center gap-2"
                onClick={exportJSON}
                disabled={!programs.length}
              >
                <FileDown className="h-4 w-4" />
                <span className="hidden sm:inline">Export JSON</span>
              </Button>
              <Button 
                className="flex-1 flex items-center gap-2 bg-affiliate-purple hover:bg-affiliate-purple/90"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Program</span>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Featured Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.slice(0, 3).map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">All Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.slice(3).map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
          
          {filteredPrograms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No programs found matching your search.</p>
            </div>
          )}
        </div>

        {/* Add Program Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white p-8 rounded-lg max-w-md w-full relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowAddModal(false)}>&times;</button>
              <h2 className="text-xl font-semibold mb-4">Add New Program</h2>
              <form onSubmit={handleAddProgram} className="flex flex-col gap-3">
  <input
    type="text"
    placeholder="Name"
    value={newProgram.name}
    onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
    required
  />
  {/* Category Dropdown */}
  <div>
    <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
    <Select
      value={newProgram.category}
      onValueChange={(val: string) => setNewProgram({ ...newProgram, category: val })}
      disabled={loadingCategories}
      required
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        {categoryOptions.map((cat) => (
          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
  <input
    type="text"
    placeholder="Commission"
    value={newProgram.commission}
    onChange={(e) => setNewProgram({ ...newProgram, commission: e.target.value })}
  />
  {/* Platform Dropdown */}
  <div>
    <label className="block text-xs font-medium text-gray-600 mb-1">Platform</label>
    <Select
      value={newProgram.platform}
      onValueChange={(val: string) => setNewProgram({ ...newProgram, platform: val })}
      disabled={loadingPlatforms}
      required
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select platform" />
      </SelectTrigger>
      <SelectContent>
        {platformOptions.map((plat) => (
          <SelectItem key={plat} value={plat}>{plat}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
  <input
    type="text"
    placeholder="Description"
    value={newProgram.description}
    onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
  />
  <input
    type="url"
    placeholder="Image URL"
    value={newProgram.image}
    onChange={(e) => setNewProgram({ ...newProgram, image: e.target.value })}
  />
  <button type="submit" className="bg-affiliate-purple text-white py-2 rounded hover:bg-affiliate-purple/90">Add Program</button>
</form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Programs;
