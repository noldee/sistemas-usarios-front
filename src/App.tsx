import { useEffect, useState } from "react";
import { getUsuarios, createUsuario, deleteUsuario, updateUsuario } from "@/api/usuarioApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {  Users,  Trash2,Pencil, Search, UserPlus2 } from "lucide-react";

interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  prioridad: number;
}

function App() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<Usuario>({ nombre: "", email: "", prioridad: 1 });

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarUsuarios(); }, []);

  const handleSubmit = async () => {
    if (!form.nombre || !form.email) return;
    isEditing && form.id ? await updateUsuario(form) : await createUsuario(form);
    resetForm();
    cargarUsuarios();
  };

  const handleEliminar = async (id?: number) => {
    if (id && confirm("¿Eliminar usuario?")) {
      await deleteUsuario(id);
      cargarUsuarios();
    }
  };

  const resetForm = () => {
    setForm({ nombre: "", email: "", prioridad: 1 });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-blue-100">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        
        {/* Header Minimalista */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users size={18} className="text-white" />
              </div>
              <span className="text-sm font-bold tracking-widest uppercase">Console</span>
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Team Members</h1>
            <p className="text-slate-500 font-medium">Manage your team and their system priorities.</p>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Capacity</span>
            <div className="text-3xl font-light tracking-tighter">
              {usuarios.length} <span className="text-slate-300 text-xl">/ 100</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Formulario Moderno (Estilo Shadcn Pure) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                {isEditing ? <Pencil size={14} className="text-amber-500" /> : <UserPlus2 size={14} className="text-blue-600" />}
                {isEditing ? "Edit Member" : "Add Member"}
              </h3>
            </div>

            <Card className="border-slate-200/60 shadow-sm bg-white rounded-2xl">
              <CardContent className="p-6 space-y-5">
                <div className="space-y-4">
                  <div className="group space-y-2">
                    <label className="text-[13px] font-semibold text-slate-600 ml-1 transition-colors group-focus-within:text-blue-600">Full Name</label>
                    <Input
                      className="h-11 rounded-xl border-slate-200 focus-visible:ring-1 focus-visible:ring-blue-600 bg-slate-50/30 transition-all"
                      placeholder="Your Name"
                      value={form.nombre}
                      onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    />
                  </div>
                  <div className="group space-y-2">
                    <label className="text-[13px] font-semibold text-slate-600 ml-1 transition-colors group-focus-within:text-blue-600">Email Address</label>
                    <Input
                      type="email"
                      className="h-11 rounded-xl border-slate-200 focus-visible:ring-1 focus-visible:ring-blue-600 bg-slate-50/30 transition-all"
                      placeholder="youremail@gmail.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div className="group space-y-2">
                    <label className="text-[13px] font-semibold text-slate-600 ml-1 transition-colors group-focus-within:text-blue-600">Priority Level</label>
                    <Input
                      type="number"
                      className="h-11 rounded-xl border-slate-200 focus-visible:ring-1 focus-visible:ring-blue-600 bg-slate-50/30 transition-all"
                      value={form.prioridad}
                      onChange={(e) => setForm({ ...form, prioridad: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <Button 
                    onClick={handleSubmit} 
                    className={`w-full h-11 rounded-xl font-semibold transition-all ${
                      isEditing ? 'bg-amber-500 hover:bg-amber-600' : 'bg-slate-900 hover:bg-blue-700'
                    }`}
                  >
                    {isEditing ? "Update Member" : "Create Account"}
                  </Button>
                  {isEditing && (
                    <Button variant="ghost" onClick={resetForm} className="h-11 rounded-xl text-slate-500">
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabla Limpia (Estilo Linear/Vercel) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Directory</h3>
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input placeholder="Search..." className="pl-9 pr-4 py-1.5 text-sm bg-transparent border-b border-slate-200 outline-none focus:border-blue-600 transition-all w-40 md:w-64" />
               </div>
            </div>

            <Card className="border-slate-200/60 shadow-sm bg-white rounded-2xl overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent border-slate-100">
                    <TableHead className="w-[80px] text-slate-400 font-bold py-4">ID</TableHead>
                    <TableHead className="text-slate-900 font-bold">User</TableHead>
                    <TableHead className="text-slate-900 font-bold">Priority</TableHead>
                    <TableHead className="text-right text-slate-900 font-bold pr-8">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarios.map((u) => (
                    <TableRow key={u.id} className="border-slate-100 hover:bg-slate-50/40 transition-colors">
                      <TableCell className="font-mono text-[11px] text-slate-400">#{u.id}</TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                            {u.nombre.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-800 text-[15px]">{u.nombre}</span>
                            <span className="text-xs text-slate-500">{u.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="rounded-md px-2 py-0 border-slate-200 font-medium text-slate-600">
                          Level {u.prioridad}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => { setForm(u); setIsEditing(true); }} className="w-8 h-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Pencil size={15} />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEliminar(u.id)} className="w-8 h-8 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                            <Trash2 size={15} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {usuarios.length === 0 && !loading && (
                <div className="py-32 text-center space-y-3">
                  <div className="inline-flex w-12 h-12 rounded-full bg-slate-50 items-center justify-center">
                    <Users className="text-slate-200" size={24} />
                  </div>
                  <p className="text-slate-400 text-sm font-medium italic">Directory is empty.</p>
                </div>
              )}
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;