"use server";

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "../superbase";

export const createCompanion = async (formData: CreateCompanion) => {
  const { userId: author } = await auth();
  const supabase = await createSupabaseClient(); // now correct

  const { data, error } = await supabase
    .from("companions")
    .insert({ ...formData, author })
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to create companion");
  }

  return data;
};

export const getAllCompanions = async ({
  limit = 10,
  page = 1,
  subject,
  topic,
}: GetAllCompanions) => {
  const supabase = await createSupabaseClient();

  let query = supabase.from("companions").select();

  if (subject && topic) {
    // cloumn + pattern
    query = query
      .ilike("subject", `%${subject}%`)
      .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  } else if (subject) {
    query = query.ilike("subject", `%${subject}%`);
  } else if (topic) {
    query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  }

  //  1) 0 , 8
  //  2) 9 , 17
  query = query.range((page - 1) * limit, page * limit - 1);

  const { data: companions, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return companions;
};

export const getCompanionById = async (id: string) => {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from("companions")
    .select()
    .eq("id", id)
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Companion not found");
  }

  return data;
};
