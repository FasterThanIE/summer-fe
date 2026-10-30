import "server-only";
import { z } from "zod";

const importanceSchema = z
  .enum(["required", "preferred", "avoided", "excluded"])
  .describe("required = must match, preferred = nice to have, avoided = rather not, excluded = must not match.");

const singleValueImportanceSchema = z
  .enum(["required", "preferred"])
  .describe("required = must match, preferred = nice to have.");

export function createSearchFiltersSchema(amenityNames: [string, ...string[]]) {
  return z.object({
    places: z
      .array(
        z.object({
          name: z
            .string()
            .describe(
              "Standard Serbian name in plain Latin letters without diacritics (the search ignores them), nominative, as Serbian travel agencies write it, e.g. Grcka, Solun, Halkidiki, Kasandra, Krf, Pefkohori, Olimpska rivijera, Olimpik Bic. Never the English or Greek form.",
            ),
          type: z
            .enum(["country", "region", "city"])
            .describe(
              "region = any area, island or tourist region (Halkidiki, Kasandra, Krf, Olimpska rivijera); city = a city, town or village (Solun, Pefkohori).",
            ),
          near: z.boolean().describe('true when the user wants places near it, e.g. "blizu Soluna", "oko Soluna".'),
          radius_km: z.number().nullable().describe('Only when the user gives a distance, e.g. "do 15 km od Soluna".'),
          importance: importanceSchema,
        }),
      )
      .nullable()
      .describe("Places the user named. Several wanted places are all required; results may come from any of them."),
    months: z
      .array(z.object({ value: z.number().int().describe("Month number, 1 = January, 12 = December."), importance: importanceSchema }))
      .nullable()
      .describe("Months of arrival when the user gives no days."),
    check_in: z
      .object({
        from: z.string().describe("Earliest arrival date, YYYY-MM-DD."),
        to: z.string().describe("Latest arrival date, YYYY-MM-DD."),
        importance: singleValueImportanceSchema,
      })
      .nullable()
      .describe("Arrival dates when the user gives days."),
    nights: z
      .object({
        min: z.number().int().nullable(),
        max: z.number().int().nullable(),
        importance: singleValueImportanceSchema,
      })
      .nullable(),
    adults: z
      .object({ min: z.number().int(), max: z.number().int().nullable() })
      .nullable()
      .describe('Adults, or all people when the user does not mention children ("3 do 5 osoba" = min 3, max 5).'),
    kids: z
      .object({ min: z.number().int(), max: z.number().int().nullable() })
      .nullable()
      .describe('Children, only when the user mentions them. Count named children too, e.g. "Milos i Marko" = 2.'),
    budget: z
      .object({
        min_eur: z.number().nullable().describe('Lowest price, only when the user gives one, e.g. "od 500 do 1000 evra", "preko 500 evra".'),
        max_eur: z.number().nullable().describe('Highest price, e.g. "do 1000 evra".'),
        per: z.enum(["stay", "night"]).describe('night when the user says "po noci", otherwise stay.'),
        importance: singleValueImportanceSchema,
      })
      .nullable(),
    beach: z
      .object({
        min_meters: z
          .number()
          .int()
          .nullable()
          .describe('Only when the user does not want to be too close, e.g. "ne na samoj plazi" = 21.'),
        max_meters: z.number().int().nullable().describe("Only when the user gives meters."),
        band: z
          .enum(["beachfront", "near", "short_walk", "walk", "far"])
          .nullable()
          .describe("When the user describes the distance in words: beachfront 0-20 m, near 21-100 m, short_walk 101-300 m, walk 301-700 m, far over 700 m."),
        importance: singleValueImportanceSchema,
      })
      .nullable(),
    amenities: z.array(z.object({ name: z.enum(amenityNames), importance: importanceSchema })).nullable(),
    unit_types: z
      .array(z.object({ value: z.enum(["apartment", "studio", "duplex", "room", "hotel_room"]), importance: importanceSchema }))
      .nullable(),
    special_offer: z
      .object({ value: z.enum(["first_minute", "last_minute"]), importance: singleValueImportanceSchema })
      .nullable(),
    has_discount: z
      .object({ importance: singleValueImportanceSchema })
      .nullable()
      .describe("The user wants a discounted price (popust, snizenje)."),
  });
}

export function createAiSearchResultSchema(amenityNames: [string, ...string[]]) {
  const filtersSchema = createSearchFiltersSchema(amenityNames);
  const errorSchema = z.object({
    field: filtersSchema.keyof(),
    value: z.string().describe("The value the user gave, in a few words, without diacritics, e.g. SELECT * FROM users."),
  });
  const noticeSchema = z.object({
    field: filtersSchema.keyof(),
    kind: z
      .enum(["not_filterable", "other_currency"])
      .describe("not_filterable = a wish we have no filter for, e.g. an amenity that is not in the list; other_currency = a budget not in euros."),
    wish: z.string().describe("The user's wish in a few words, without diacritics, e.g. djakuzi or 200000 dinara."),
  });

  return z.object({
    data: filtersSchema,
    errors: z
      .array(errorSchema)
      .describe("Only for a value that makes no sense for its field, e.g. a place name where a number is expected, SQL, code or gibberish."),
    notices: z
      .array(noticeSchema)
      .describe("Normal wishes we cannot filter by, e.g. an amenity that is not in the list or a budget in another currency. These are not errors."),
  });
}
