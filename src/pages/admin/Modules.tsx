import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';

interface Module {
  id: string;
  title: string;
  description: string;
  bannerUrl?: string;
  lessons: string[]; // array of lesson IDs
}

const Modules: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getDocs(collection(db, 'modules')).then(snap => {
      const list: Module[] = [];
      snap.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() } as Module);
      });
      setModules(list);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Modules</h1>
      {loading ? (
        <div>Loading modules...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {modules.map(module => (
            <div key={module.id} className="bg-white rounded shadow p-4 flex flex-col">
              {module.bannerUrl && (
                <img src={module.bannerUrl} alt={module.title} className="rounded mb-4 object-cover h-40 w-full" />
              )}
              <h2 className="text-xl font-bold mb-2">{module.title}</h2>
              <p className="mb-4 text-gray-600">{module.description}</p>
              <Link href={`/modules/${module.id}`} legacyBehavior>
                <a className="mt-auto px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 text-center">View Module</a>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Modules;
