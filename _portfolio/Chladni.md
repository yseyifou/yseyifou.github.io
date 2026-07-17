---
title: "Chladni Figures Simulation"
excerpt: "Numerical simulation of vibrating plates and Chladni figures using C++ and Python."
collection: portfolio
date: 2026
---

This project simulates the dynamic behavior of a vibrating brass plate using the **Finite Difference Time Domain (FDTD)** method to solve the biharmonic wave equation. It generates beautiful Chladni patterns — the geometric figures that form when sand accumulates on a vibrating plate's nodal lines.

The simulation supports three distinct physical setups:

1. **Simply Supported Plate** – Sinusoidal initial deformation with fixed boundaries.
2. **Free Plate (Gaussian Deformation)** – Free boundaries with a Gaussian impact.
3. **Free Plate (Forced Regime)** – Free boundaries excited by a central periodic force, generating steady-state Chladni patterns.

**Physics parameters** (brass plate):
- Young's Modulus: 130 × 10⁹ Pa
- Thickness: 0.002 m
- Density: 8500 kg/m³
- Poisson's Ratio: 0.37
- Grid: 101 × 101

**Visualization outputs** (Python):
- Time series & FFT spectrum (identifying resonance frequencies)
- 2D Chladni pattern contour plot (nodal lines)
- 3D animation of the plate's deflection over time

**Tech stack:** C++ (simulation core) + Python with NumPy, Matplotlib, SciPy (post-processing and visualization).

[GitHub Repository](https://github.com/yseyifou/Chladni-Figures)
