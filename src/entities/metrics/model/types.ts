export type CoffeeBrandMetric = {
  brand: string;
  popularity: number;
};

export type SnackBrandMetric = {
  name: string;
  share: number;
};

export type WeeklyMoodMetric = {
  week: string;
  happy: number;
  tired: number;
  stressed: number;
};

export type WeeklyWorkoutMetric = {
  week: string;
  running: number;
  cycling: number;
  stretching: number;
};

export type CoffeeConsumptionPoint = {
  cups: number;
  bugs: number;
  productivity: number;
};

export type CoffeeConsumptionTeam = {
  team: string;
  series: CoffeeConsumptionPoint[];
};

export type CoffeeConsumptionResponse = {
  teams: CoffeeConsumptionTeam[];
};

export type SnackImpactPoint = {
  snacks: number;
  meetingsMissed: number;
  morale: number;
};

export type SnackImpactDepartment = {
  name: string;
  metrics: SnackImpactPoint[];
};

export type SnackImpactResponse = {
  departments: SnackImpactDepartment[];
};
