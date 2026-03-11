df <- read_csv("datarepo/ESS.csv", show_col_types = FALSE) 
codebook <- read_csv("datarepo/codebook_ESS.csv", show_col_types = FALSE) 

# 1. Choose a random numeric variable
numeric_cols <- names(df)[sapply(df, is.numeric)]
selected_var <- sample(numeric_cols, 1)
codebook_var<-codebook$nice_description[codebook$variable==selected_var]

# 2. Random sample size
n <- sample(15:40, 1)

var_data<-df[[selected_var]]
var_data<-var_data[!is.na(var_data)]

pop_n<-length(var_data)

# 3. Draw sample WITHOUT replacement
sample_data <- sample(var_data, n, replace = FALSE)

# 4. Compute 95% CI
tt <- t.test(sample_data, conf.level = 0.95)
ci <- unname(tt$conf.int)

# 5. True parameter
true_value <- mean(var_data, na.rm = TRUE)

# 6. Containment
contained <- true_value >= ci[1] && true_value <= ci[2]

# 7. Build today.json (single source of truth)
today <- list(
  interval = ci,
  sample_size = paste0(n," people"),
  raw_data = unname(sample_data),
  parameter_name = paste0("average ", codebook_var," of ",pop_n," who took the European Social Survey in 2022"),
  true_value = true_value,
  source = "ESS.csv",
  contained = contained
)

write_json(today, "data/today.json", pretty = TRUE, auto_unbox = TRUE)




