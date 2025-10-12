/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as companies from "../companies.js";
import type * as customers from "../customers.js";
import type * as employees from "../employees.js";
import type * as equipment from "../equipment.js";
import type * as jobSites from "../jobSites.js";
import type * as loadouts from "../loadouts.js";
import type * as projects from "../projects.js";
import type * as quotes from "../quotes.js";
import type * as seedData from "../seedData.js";
import type * as timeTracker from "../timeTracker.js";
import type * as whitelist from "../whitelist.js";
import type * as workAreas from "../workAreas.js";
import type * as workOrders from "../workOrders.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  companies: typeof companies;
  customers: typeof customers;
  employees: typeof employees;
  equipment: typeof equipment;
  jobSites: typeof jobSites;
  loadouts: typeof loadouts;
  projects: typeof projects;
  quotes: typeof quotes;
  seedData: typeof seedData;
  timeTracker: typeof timeTracker;
  whitelist: typeof whitelist;
  workAreas: typeof workAreas;
  workOrders: typeof workOrders;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
