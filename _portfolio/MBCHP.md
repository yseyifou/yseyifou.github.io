---
title: "MBCHProcess – Mathematica Package for MB Representations"
excerpt: "A Mathematica package for post-processing Mellin-Barnes representations and expressing series as generalized hypergeometric functions."
collection: portfolio
date: June-July 2026
---

This project is a **Mathematica package** that serves as a plugin for `MBConicHulls`. It automates the post-processing of Mellin-Barnes (MB) representations by identifying and expressing series as known generalized hypergeometric functions.

The package takes a resolved MB representation (output from `MBConicHulls`'s `ResolveMB`) and applies a systematic algebraic pipeline to the series general term:

1. **Factorization** – Factorizes Gamma arguments and applies the Gauss multiplication formula.
2. **Reflection** – Uses the reflection formula to normalize summation indices to positive signs.
3. **Pochhammer conversion** – Converts Gamma functions to Pochhammer symbols.
4. **Structure analysis** – Analyzes the index structure to map the series to standard special functions.

**Supported special functions**:
- `HypergeometricPFQ` (generalized hypergeometric)
- `AppellF1` (Appell hypergeometric series)
- Horn functions
- Lauricella A/B/C/D
- Kampé de Fériet

**Tech stack:** Wolfram Mathematica (12.0 or later).

**Prerequisites:** The `MBConicHulls` package must be installed and loaded before `MBCHProcess`.

**Authors:** Yanis Seyifou, Quentin Urzel, and Ewen Mahé (supervised by Dr. Samuel Friot, IJCLab, Orsay, France).

[GitHub Repository](https://github.com/yseyifou/MBCHProcess)
