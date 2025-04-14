import { Params } from "@angular/router";

export interface QueryParams extends Params {
  project_id: string;
  team_id: string;
}