import axios from "axios";
import type { Note, CreateNote } from "@/types/note";

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const BASE_URL = "https://notehub-public.goit.study/api/notes";
axios.defaults.headers.common.Authorization = `Bearer ${token}`;

interface GetNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface GetNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}

export const getNotes = async ({
  page,
  perPage,
  search,
  tag,
}: GetNotesParams): Promise<GetNotesResponse> => {
  const res = await axios.get<GetNotesResponse>(`${BASE_URL}`, {
    params: {
      page,
      perPage,
      search,
      tag,
    },
  });

  return res.data;
};

export const createNote = async (payload: CreateNote): Promise<Note> => {
  const { data } = await axios.post<Note>(`${BASE_URL}`, payload);
  return data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const { data } = await axios.delete<Note>(`${BASE_URL}/${noteId}`);
  return data;
};

export const fetchNoteById = async (noteId: string): Promise<Note> => {
  const { data } = await axios.get<Note>(`${BASE_URL}/${noteId}`);
  return data;
};
