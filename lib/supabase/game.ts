import { createClient } from "./client";

export async function getPlayers() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("players")
    .select("*")
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}