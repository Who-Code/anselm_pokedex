export type searchItem = {
  name: string;
  url: string;
};

export type searchResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: searchItem[];
};

export type Pokemon = {
  abilities: Ability[];
  base_experience: number;
  cries: Cries;
  forms: Species[];
  game_indices: GameIndex[];
  height: number;
  held_items: any[];
  id: number;
  is_default: boolean;
  location_area_encounters: string;
  moves: Move[];
  name: string;
  order: number;
  past_abilities: any[];
  past_types: any[];
  species: Species;
  sprites: Sprites;
  stats: Stat[];
  types: Type[];
  weight: number;
};

export type Ability = {
  ability: Species;
  is_hidden: boolean;
  slot: number;
};

export type Species = {
  name: string;
  url: string;
};

export type Cries = {
  latest: string;
  legacy: string;
};

export type GameIndex = {
  game_index: number;
  version: Species;
};

export type Move = {
  move: Species;
  version_group_details: VersionGroupDetail[];
};

export type VersionGroupDetail = {
  level_learned_at: number;
  move_learn_method: Species;
  version_group: Species;
};

export type GenerationV = {
  "black-white": Sprites;
};

export type GenerationIv = {
  "diamond-pearl": Sprites;
  "heartgold-soulsilver": Sprites;
  platinum: Sprites;
};

export type Versions = {
  "generation-i": GenerationI;
  "generation-ii": GenerationIi;
  "generation-iii": GenerationIii;
  "generation-iv": GenerationIv;
  "generation-v": GenerationV;
  "generation-vi": { [key: string]: Home };
  "generation-vii": GenerationVii;
  "generation-viii": GenerationViii;
};

export type Other = {
  dream_world: DreamWorld;
  home: Home;
  "official-artwork": OfficialArtwork;
  showdown: Sprites;
};

export type Sprites = {
  back_default: string;
  back_female: null;
  back_shiny: string;
  back_shiny_female: null;
  front_default: string;
  front_female: null;
  front_shiny: string;
  front_shiny_female: null;
  other?: Other;
  versions?: Versions;
  animated?: Sprites;
};

export type GenerationI = {
  "red-blue": RedBlue;
  yellow: RedBlue;
};

export type RedBlue = {
  back_default: string;
  back_gray: string;
  back_transparent: string;
  front_default: string;
  front_gray: string;
  front_transparent: string;
};

export type GenerationIi = {
  crystal: Crystal;
  gold: Gold;
  silver: Gold;
};

export type Crystal = {
  back_default: string;
  back_shiny: string;
  back_shiny_transparent: string;
  back_transparent: string;
  front_default: string;
  front_shiny: string;
  front_shiny_transparent: string;
  front_transparent: string;
};

export type Gold = {
  back_default: string;
  back_shiny: string;
  front_default: string;
  front_shiny: string;
  front_transparent?: string;
};

export type GenerationIii = {
  emerald: OfficialArtwork;
  "firered-leafgreen": Gold;
  "ruby-sapphire": Gold;
};

export type OfficialArtwork = {
  front_default: string;
  front_shiny: string;
};

export type Home = {
  front_default: string;
  front_female: null;
  front_shiny: string;
  front_shiny_female: null;
};

export type GenerationVii = {
  icons: DreamWorld;
  "ultra-sun-ultra-moon": Home;
};

export type DreamWorld = {
  front_default: string;
  front_female: null;
};

export type GenerationViii = {
  icons: DreamWorld;
};

export type Stat = {
  base_stat: number;
  effort: number;
  stat: Species;
};

export type Type = {
  slot: number;
  type: Species;
};

export class PokeApiService {
  private static instance: PokeApiService;

  public static getInstance(): PokeApiService {
    if (!PokeApiService.instance) {
      PokeApiService.instance = new PokeApiService();
    }

    return PokeApiService.instance;
  }

  private baseUrl: string = "https://pokeapi.co/api/v2/";

  public allPokemonList: Pokemon[] = [];

  public all = async (): Promise<Pokemon[]> => {
    console.log("All Endpoint");
    return new Promise(async (resolve) => {
      if (this.allPokemonList.length > 0) {
        console.log("Resolve Pokemons");
        resolve(this.allPokemonList);
      } else {
        console.log("Reload data");
        const listResult = await fetch(this.baseUrl + "pokemon?limit=12");
        if (!listResult.ok) {
          throw new Error("Netzwerkantwort war nicht ok");
        }
        const parsedResult = (await listResult.json()) as searchResponse;
        const detailList: Pokemon[] = [];
        for (const result of parsedResult.results) {
          const resolvedPokemon = await this.get(result.name);
          detailList.push(resolvedPokemon);
        }
        this.allPokemonList = detailList;
        resolve(this.allPokemonList);
      }
    });
  };

  public Name = (offset: number, limit: number): Promise<{ count: number; results: Pokemon[] }> => {
    return new Promise(async (resolve) => {
      const listResult = await fetch(this.baseUrl + "pokemon?offset=" + offset + "&limit=" + limit);
      if (!listResult.ok) {
        throw new Error("Netzwerkantwort war nicht ok");
      }
      const parsedResult = (await listResult.json()) as searchResponse;
      const detailList: Pokemon[] = [];
      for (const result of parsedResult.results) {
        const resolvedPokemon = await this.get(result.name);
        detailList.push(resolvedPokemon);
      }
      //setTimeout(() => {
      resolve({
        count: parsedResult.count,
        results: detailList,
      });
      // }, 3000);
    });
  };

  public get = async (pokemonName: string) => {
    const listResult = await fetch(this.baseUrl + "pokemon/" + pokemonName);
    if (!listResult.ok) {
      throw new Error("Netzwerkantwort war nicht ok");
    }
    const parsedResult = (await listResult.json()) as Pokemon;
    return parsedResult;
  };
}
