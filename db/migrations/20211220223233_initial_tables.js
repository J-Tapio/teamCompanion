import countries from "../utils/countries.js";

export function up(knex) {
  console.log("Knex/DB - CREATE TABLES");
  return knex.schema
  .createTable("users", function(table) {
    table.increments("id").primary();
    table.string("email", 100).unique().notNullable();
    table.string("password", 100).notNullable();
    table.enu("role", ["admin", "user"]).defaultTo("user");
    table.integer("createdBy").nullable();
    table.string("refresh_token").nullable();
    table
      .timestamp("created_at", { useTz: true, precision: 0})
      .defaultTo(knex.fn.now(0));
    table
      .timestamp("updated_at", { useTz: true, precision: 0})
      .defaultTo(knex.fn.now(0));
  })

  .createTable("teams", function(table) {
    table.increments("id").primary();
    table.string("team_name", 100).unique();
    table.string("street_address", 255);
    table.string("city", 100);
    table.string("zip_code", 100);
    table.string("state", 100);
    table.enu("country", countries);
    table.integer("created_by").nullable();
    table.foreign("created_by")
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");
    table
      .timestamp("created_at", { useTz: true, precision: 0 })
      .defaultTo(knex.fn.now(0));
    table
      .timestamp("updated_at", { useTz: true, precision: 0 })
      .defaultTo(knex.fn.now(0));
  })

  .createTable("user_information", function(table) {
    table.increments("id").primary();
    table.integer("user_id");
    table.foreign("user_id")
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.string("first_name", 100);
    table.string("last_name", 100);
    table.date("date_of_birth");
    table.string("street_address", 255);
    table.string("city", 100);
    table.string("zip_code", 100);
    table.string("state", 100);
    table.enu("country", countries);
    table
      .timestamp("created_at", { useTz: true, precision: 0 })
      .defaultTo(knex.fn.now(0));
    table
      .timestamp("updated_at", { useTz: true, precision: 0 })
      .defaultTo(knex.fn.now(0));
  })

  .createTable("user_teams", function(table) {
    table.increments("id").primary();
    table.integer("user_id");
    table
    .foreign("user_id")
    .references("id")
    .inTable("users")
    .onUpdate("CASCADE")
    .onDelete("CASCADE")
    table.integer("team_id");
    table
      .foreign("team_id")
      .references("id")
      .inTable("teams")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.enu("team_role", [
        "Coach",
        "Physiotherapist",
        "Trainer",
        "Athlete",
        "Staff",
      ]);
    table.enu("status", ["Active", "Injured", "Inactive", "Vacation", "Sick"]);
    table
      .timestamp("created_at", { useTz: true, precision: 0 })
      .defaultTo(knex.fn.now(0));
    table
      .timestamp("updated_at", { useTz: true, precision: 0 })
      .defaultTo(knex.fn.now(0));
  })

  .createTable("activity_types", function(table) {
    table.increments("id").primary();
    table.string("activity_type");
    table.integer("created_by");
    table
      .foreign("created_by")
      .references("id")
      .inTable("user_teams")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table
      .timestamp("created_at", { useTz: true, precision: 0 })
      .defaultTo(knex.fn.now(0));
    table
      .timestamp("updated_at", { useTz: true, precision: 0 })
      .defaultTo(knex.fn.now(0));
  })

  .createTable("venues", function(table) {
    table.increments("id").primary();
    table.string("venue_name");
    table.string("street_address", 255);
    table.string("city", 100);
    table.string("zip_code", 100);
    table.string("state", 100);
    table.enu("country", countries);
    table.integer("teamId");
    table
      .foreign("teamId")
      .references("id")
      .inTable("teams")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  })

  .createTable("team_activities", function(table) {
    table.increments("id").primary();
    table.integer("team_id");
    table
      .foreign("team_id")
      .references("id")
      .inTable("teams")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.integer("created_by");
    table
      .foreign("created_by")
      .references("id")
      .inTable("user_teams")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.integer("activity_type_id");
    table
      .foreign("activity_type_id")
      .references("id")
      .inTable("activity_types")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.string("opponent_name").nullable();
    table.string("opponent_logo").nullable();
    table.string("activity_notes").nullable();
    table.integer("venue_id").nullable();
    table
      .foreign("venue_id")
      .references("id")
      .inTable("venues")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.datetime("activity_start", { useTz: true, precision: 0 });
    table.datetime("activity_end", { useTz: true, precision: 0 });
    table.integer("updated_by").nullable();
    table
      .timestamp("created_at", { useTz: true, precision: 0 })
      .defaultTo(knex.fn.now(0));
    table
      .timestamp("updated_at", { useTz: true, precision: 0 })
      .defaultTo(knex.fn.now(0));
  })

  .createTable("user_team_activities", function(table) {
    table.increments("id").primary();
    table.integer("user_team_id");
    table
      .foreign("user_team_id")
      .references("id")
      .inTable("user_teams")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.integer("team_activity_id");
    table
      .foreign("team_activity_id")
      .references("id")
      .inTable("team_activities")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.unique(["user_team_id", "team_activity_id"])
    table.integer("rpe_value").nullable();
    table
      .timestamp("created_at", { useTz: true, precision: 0 })
      .defaultTo(knex.fn.now(0));
    table
      .timestamp("updated_at", { useTz: true, precision: 0 })
      .defaultTo(knex.fn.now(0));
  })

  .createTable("equipment", function(table) {
    table.increments("id").primary();
    table.string("equipment_name", 100).unique();
    table.string("equipment_info").nullable();
    table.enu("training_modality", ["Cardio", "Strength"]);
    table.integer("created_by");
    table
      .foreign("created_by")
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table
      .timestamp("created_at", { useTz: true, precision: 0 })
      .defaultTo(knex.fn.now(0));
    table
      .timestamp("updated_at", { useTz: true, precision: 0 })
      .defaultTo(knex.fn.now(0));
  })

  .createTable("exercises", function(table) {
    table.increments("id").primary();
    table.string("exercise_name", 100).unique();
    table.text("exercise_info").nullable();
    table.integer("created_by");
    table
      .foreign("created_by")
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table
      .timestamp("created_at", { useTz: true, precision: 0 })
      .defaultTo(knex.fn.now(0));
    table
      .timestamp("updated_at", { useTz: true, precision: 0 })
      .defaultTo(knex.fn.now(0));
  })

  .createTable("exercises_equipment", function(table) {
    table.increments("id").primary();
    table.integer("equipment_id").notNullable();
    table
      .foreign("equipment_id")
      .references("id")
      .inTable("equipment")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.integer("exercise_id").notNullable();
    table
      .foreign("exercise_id")
      .references("id")
      .inTable("exercises")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.specificType("exercise_variations", "text ARRAY").nullable();
    table.specificType("exercise_positions", "text ARRAY").nullable();
    table.text("exercise_information").nullable();
    table
      .timestamp("created_at", { useTz: true, precision: 0 })
      .defaultTo(knex.fn.now(0));
    table
      .timestamp("updated_at", { useTz: true, precision: 0 })
      .defaultTo(knex.fn.now(0));
  })

  .createTable("exercise_sets", function(table) {
    table.increments("id").primary();
    table.integer("user_team_activities_id").notNullable();
    table
      .foreign("user_team_activities_id")
      .references("id")
      .inTable("user_team_activities")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.integer("exercises_equipment_id").notNullable();
    table
      .foreign("exercises_equipment_id")
      .references("id")
      .inTable("exercises_equipment")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.decimal("ex_weight", 4, 2);
    table.integer("ex_repetitions");
    table.integer("ex_duration");
    table.integer("ex_distance");
    table.specificType("ex_variations", "text ARRAY").nullable();
  })
};

export function down(knex) {
  console.log("Knex/DB - DROP TABLES");
  
  return knex.schema
  .dropTableIfExists("exercise_sets")
  .dropTableIfExists("user_team_activities")
  .dropTableIfExists("team_activities")
  .dropTableIfExists("activity_types")
  .dropTableIfExists("user_teams")
  .dropTableIfExists("exercises_equipment")
  .dropTableIfExists("exercises")
  .dropTableIfExists("equipment")
  .dropTableIfExists("user_information")
  .dropTableIfExists("venues")
  .dropTableIfExists("teams")
  .dropTableIfExists("users")
};


