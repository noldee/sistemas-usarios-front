import axios from "axios";

// Definimos la interfaz aquí o impórtala si la tienes en otro archivo
export interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  prioridad: number;
}

const api = axios.create({
  baseURL: "https://profound-celebration-production-e18c.up.railway.app",
});

// READ - Obtener todos
export const getUsuarios = async (): Promise<Usuario[]> => {
  const response = await api.get<Usuario[]>("/usuario");
  return response.data;
};

// READ - Obtener por ID
export const getUsuarioById = async (id: number): Promise<Usuario> => {
  const response = await api.get<Usuario>(`/usuario/${id}`);
  return response.data;
};

// CREATE - Guardar nuevo
export const createUsuario = async (usuario: Usuario): Promise<Usuario> => {
  const response = await api.post<Usuario>("/usuario", usuario);
  return response.data;
};

// DELETE - Eliminar
export const deleteUsuario = async (id: number): Promise<void> => {
  await api.delete(`/usuario/${id}`);
};

// UPDATE - Actualizar (Asumiendo que tu backend usa POST para guardar/actualizar o PUT)
export const updateUsuario = async (usuario: Usuario): Promise<Usuario> => {
  // En Spring Boot, el mismo método save() suele manejar el update si el ID existe
  const response = await api.post<Usuario>("/usuario", usuario);
  return response.data;
};

// QUERY - Filtrar por prioridad
export const getUsuariosPorPrioridad = async (prioridad: number): Promise<Usuario[]> => {
  const response = await api.get<Usuario[]>(`/usuario/query?prioridad=${prioridad}`);
  return response.data;
};

export default api;