import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Recipe } from "../backend.d";
import { useActor } from "./useActor";

export function useAllRecipes() {
  const { actor, isFetching } = useActor();
  return useQuery<Recipe[]>({
    queryKey: ["recipes", "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRecipes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRecipesByMood(mood: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Recipe[]>({
    queryKey: ["recipes", "mood", mood],
    queryFn: async () => {
      if (!actor || !mood) return [];
      return actor.getRecipesByMood(mood);
    },
    enabled: !!actor && !isFetching && !!mood,
  });
}

export function useFavorites() {
  const { actor, isFetching } = useActor();
  return useQuery<Recipe[]>({
    queryKey: ["favorites"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFavorites();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useToggleFavorite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.toggleFavorite(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
  });
}

export function useRegister() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.register();
    },
  });
}
