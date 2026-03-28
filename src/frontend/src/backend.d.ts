import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Mood = string;
export interface Recipe {
    id: bigint;
    name: string;
    description: string;
    emoji: string;
    moodTags: Array<Mood>;
    prepTime: bigint;
    category: string;
}
export interface backendInterface {
    getAllRecipes(): Promise<Array<Recipe>>;
    getFavorites(): Promise<Array<Recipe>>;
    getRecipesByMood(mood: Mood): Promise<Array<Recipe>>;
    register(): Promise<void>;
    toggleFavorite(id: bigint): Promise<void>;
}
