library(dplyr)
library(readr)
library(jsonlite)

df <- read_csv("datarepo/state_demographics.csv", show_col_types = FALSE) |>
  mutate(across(-State, ~ suppressWarnings(as.numeric(.))))

nice_labels <- c(
  "State" = "State",
  "Population.2014 Population" = "2014 population",
  "Population.2010 Population" = "2010 population",
  
  "Age.Percent Under 5 Years" = "percent of residents under age 5",
  "Age.Percent Under 18 Years" = "percent of residents under age 18",
  "Age.Percent 65 and Older" = "percent of residents age 65 and older",
  
  "Miscellaneous.Percent Female" = "percent female",
  
  "Ethnicities.White Alone" = "percent White",
  "Ethnicities.Black Alone" = "percent Black",
  "Ethnicities.American Indian and Alaska Native Alone" = "percent American Indian or Alaska Native",
  "Ethnicities.Asian Alone" = "percent Asian",
  "Ethnicities.Native Hawaiian and Other Pacific Islander Alone" = "percent Native Hawaiian or Pacific Islander",
  "Ethnicities.Two or More Races" = "percent identifying as two or more races",
  "Ethnicities.Hispanic or Latino" = "percent Hispanic or Latino",
  "Ethnicities.White Alone, not Hispanic or Latino" = "percent White (non‑Hispanic)",
  
  "Miscellaneous.Veterans" = "number of veterans",
  "Miscellaneous.Foreign Born" = "percent foreign‑born",
  
  "Housing.Housing Units" = "number of housing units",
  "Housing.Homeownership Rate" = "homeownership rate",
  "Housing.Median Value of Owner-Occupied Units" = "median home value",
  "Housing.Households" = "number of households",
  "Housing.Persons per Household" = "persons per household",
  
  "Miscellaneous.Living in Same House +1 Years" = "percent living in the same house for 1+ years",
  "Miscellaneous.Language Other than English at Home" = "percent speaking a non‑English language at home",
  
  "Housing.Households with a computer" = "percent of households with a computer",
  "Housing.Households with a Internet" = "percent of households with internet access",
  
  "Education.High School or Higher" = "percent with a high school diploma or higher",
  "Education.Bachelor's Degree or Higher" = "percent with a bachelor’s degree or higher",
  
  "Miscellaneous.Percent Under 66 Years With a Disability" = "percent under age 66 with a disability",
  "Miscellaneous.Percent Under 65 Years Witout Health insurance" = "percent under age 65 without health insurance",
  
  "Sales.Accommodation and Food Services Sales" = "accommodation and food services sales",
  "Miscellaneous.Manufacturers Shipments" = "manufacturers’ shipments",
  "Sales.Retail Sales" = "retail sales",
  
  "Miscellaneous.Mean Travel Time to Work" = "mean travel time to work",
  "Income.Median Houseold Income" = "median household income",
  "Income.Per Capita Income" = "per‑capita income",
  "Income.Persons Below Poverty Level" = "percent of persons below the poverty level",
  
  "Employment.Nonemployer Establishments" = "number of nonemployer establishments",
  "Employment.Firms.Total" = "total number of firms",
  "Employment.Firms.Men-Owned" = "number of men‑owned firms",
  "Employment.Firms.Women-Owned" = "number of women‑owned firms",
  "Employment.Firms.Minority-Owned" = "number of minority‑owned firms",
  "Employment.Firms.Nonminority-Owned" = "number of non‑minority‑owned firms",
  "Employment.Firms.Veteran-Owned" = "number of veteran‑owned firms",
  "Employment.Firms.Nonveteran-Owned" = "number of non‑veteran‑owned firms",
  
  "Population.Population per Square Mile" = "population density",
  "Miscellaneous.Land Area" = "land area"
)

colnames(df) <- nice_labels

# 1. Choose a random numeric variable
numeric_cols <- names(df)[sapply(df, is.numeric)]
selected_var <- sample(numeric_cols, 1)

# 2. Random sample size
n <- sample(5:20, 1)

# 3. Draw sample WITHOUT replacement
sample_data <- sample(df[[selected_var]], n, replace = FALSE)

# 4. Compute 95% CI
tt <- t.test(sample_data, conf.level = 0.95)
ci <- unname(tt$conf.int)

# 5. True parameter
true_value <- mean(df[[selected_var]], na.rm = TRUE)

# 6. Containment
contained <- true_value >= ci[1] && true_value <= ci[2]

# 7. Build today.json (single source of truth)
today <- list(
  interval = ci,
  sample_size = n,
  raw_data = unname(sample_data),
  parameter_name = selected_var,
  true_value = true_value,
  source = "state_demographics.csv",
  contained = contained,
  day = as.character(Sys.Date())
)

write_json(today, "data/today.json", pretty = TRUE, auto_unbox = TRUE)
