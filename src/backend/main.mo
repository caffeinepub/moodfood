import Map "mo:core/Map";
import Array "mo:core/Array";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";

actor {
  type Mood = Text;

  type Recipe = {
    id : Nat;
    name : Text;
    description : Text;
    moodTags : [Mood];
    category : Text;
    prepTime : Nat;
    emoji : Text;
  };

  module Recipe {
    public func compare(recipe1 : Recipe, recipe2 : Recipe) : Order.Order {
      Nat.compare(recipe1.id, recipe2.id);
    };
  };

  type User = {
    favorites : Set.Set<Nat>;
  };

  let recipes = Map.empty<Nat, Recipe>();
  let users = Map.empty<Principal, User>();

  func getUser(caller : Principal) : User {
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?user) { user };
    };
  };

  public query ({ caller }) func getAllRecipes() : async [Recipe] {
    recipes.values().toArray().sort();
  };

  public query ({ caller }) func getRecipesByMood(mood : Mood) : async [Recipe] {
    recipes.values().toArray().filter(
      func(recipe) {
        recipe.moodTags.find(func(m) { m == mood }) != null;
      }
    );
  };

  public shared ({ caller }) func toggleFavorite(id : Nat) : async () {
    if (not recipes.containsKey(id)) { Runtime.trap("Recipe does not exist") };
    let user = getUser(caller);
    if (user.favorites.contains(id)) {
      user.favorites.remove(id);
    } else {
      user.favorites.add(id);
    };
    users.add(caller, user);
  };

  public query ({ caller }) func getFavorites() : async [Recipe] {
    let user = getUser(caller);
    user.favorites.toArray().sort().map(
      func(id) {
        switch (recipes.get(id)) {
          case (null) { Runtime.trap("Recipe not found") };
          case (?recipe) { recipe };
        };
      }
    );
  };

  public shared ({ caller }) func register() : async () {
    if (users.containsKey(caller)) { Runtime.trap("User already exists") };
    let newUser : User = {
      favorites = Set.empty<Nat>();
    };
    users.add(caller, newUser);
  };

  let initialRecipes = [
    {
      id = 1;
      name = "Mac and Cheese";
      description = "Classic comfort food, creamy and cheesy.";
      moodTags = ["Sad", "Relaxed"];
      category = "Comfort Food";
      prepTime = 30;
      emoji = "🧀";
    },
    {
      id = 2;
      name = "Fruit Smoothie";
      description = "Fresh and energizing blend of fruits.";
      moodTags = ["Energetic", "Tired"];
      category = "Energy Boost";
      prepTime = 10;
      emoji = "🍹";
    },
    {
      id = 3;
      name = "Chocolate Cake";
      description = "Rich and indulgent dessert for happy moments.";
      moodTags = ["Happy"];
      category = "Dessert";
      prepTime = 60;
      emoji = "🎂";
    },
    {
      id = 4;
      name = "Chicken Soup";
      description = "Warm soup for comfort during sad or tired times.";
      moodTags = ["Sad", "Tired"];
      category = "Comfort Food";
      prepTime = 40;
      emoji = "🍲";
    },
    {
      id = 5;
      name = "Spicy Tacos";
      description = "Spicy and flavorful tacos for energetic moods.";
      moodTags = ["Energetic", "Happy"];
      category = "Mexican";
      prepTime = 20;
      emoji = "🌮";
    },
    {
      id = 6;
      name = "Salad Bowl";
      description = "Healthy salad to refresh and boost energy.";
      moodTags = ["Relaxed", "Energetic"];
      category = "Healthy";
      prepTime = 15;
      emoji = "🥗";
    },
    {
      id = 7;
      name = "Pancakes";
      description = "Fluffy pancakes to start the day happy.";
      moodTags = ["Happy", "Relaxed"];
      category = "Breakfast";
      prepTime = 25;
      emoji = "🥞";
    },
    {
      id = 8;
      name = "Oatmeal";
      description = "Hearty oatmeal to treat sadness or stress.";
      moodTags = ["Sad", "Stressed"];
      category = "Comfort Food";
      prepTime = 12;
      emoji = "🥣";
    },
    {
      id = 9;
      name = "Energy Bar";
      description = "Quick energy boost for tired moments.";
      moodTags = ["Tired", "Energetic"];
      category = "Snack";
      prepTime = 5;
      emoji = "🍫";
    },
    {
      id = 10;
      name = "Ice Cream";
      description = "Cool treat for happy or sad moods.";
      moodTags = ["Happy", "Sad"];
      category = "Dessert";
      prepTime = 60;
      emoji = "🍦";
    },
    {
      id = 11;
      name = "Grilled Cheese Sandwich";
      description = "Classic sandwich to lift spirits.";
      moodTags = ["Sad", "Stressed"];
      category = "Comfort Food";
      prepTime = 15;
      emoji = "🥪";
    },
    {
      id = 12;
      name = "Sushi";
      description = "Refreshing and flavorful sushi rolls.";
      moodTags = ["Relaxed", "Happy"];
      category = "Japanese";
      prepTime = 50;
      emoji = "🍣";
    },
    {
      id = 13;
      name = "Stir Fry";
      description = "Quick and healthy stir fry for energy.";
      moodTags = ["Energetic", "Tired"];
      category = "Asian";
      prepTime = 20;
      emoji = "🥡";
    },
    {
      id = 14;
      name = "Chocolate Bar";
      description = "Quick chocolate fix for mood boost.";
      moodTags = ["Sad", "Stressed"];
      category = "Snack";
      prepTime = 2;
      emoji = "🍫";
    },
    {
      id = 15;
      name = "Pizza";
      description = "Favorite comfort food for any mood.";
      moodTags = ["Happy", "Relaxed", "Sad"];
      category = "Comfort Food";
      prepTime = 30;
      emoji = "🍕";
    },
  ];

  initialRecipes.forEach(
    func(recipe) {
      recipes.add(recipe.id, recipe);
    }
  );
};
