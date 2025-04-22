# PhenoMap

PhenoMap is a knowledge graph exploration and explanation toolkit for biomedical research. It supports embedding-based prediction using R-GCNs, baseline comparisons, and natural language explanations through large language models.

## Environment Setup

### 1. Create and Activate a Virtual Environment

```bash
python3.10 -m venv venv
source venv/bin/activate
```

Ensure your Python version is 3.10.16.

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

Then install additional PyTorch Geometric packages:

```bash
pip install pyg_lib torch_scatter torch_sparse torch_cluster torch_spline_conv -f https://data.pyg.org/whl/torch-2.5.0+cpu.html
```

## Data Setup

Create the data directory:

```bash
mkdir -p data/RAW
```

Then download the `kg.csv` file from the PrimeKG repository (There is a link to the csv file download in their README file):

https://github.com/mims-harvard/PrimeKG/tree/main

Place the file in:

```
data/RAW/kg.csv
```

## Usage Instructions

### Step 1: Preprocess the Data

Run all cells in:

```
01_process_data.ipynb
```

### Step 2: (Optional) Run Node2Vec Baseline and SNE Visualization

To evaluate the Node2Vec embedding baseline and view t-SNE projections:

```
02_baselines.ipynb
```

### Step 3: (Optional) Train R-GCN Model and Decoder Baselines

This notebook trains the R-GCN encoder and all decoder variants:

```
03_RGCN_training.ipynb
```

### Step 4: Run the Explanation Tool

To generate natural language explanations using an LLM:

```
04_explainability.ipynb
```

You will be prompted to enter a Hugging Face access token. Create a Hugging Face account, generate an access token with read access to contents of all public gated repos you can access, and request access to:

```
meta-llama/Llama-3.1-8B-Instruct
```

Access is typically granted within 15–20 minutes.

## Notes

- The tool may take 2–10 minutes per query depending on your system’s performance.
- Ensure all required files and directories are in place before running the notebooks.




