# Expanded Biopolitical Systems Model — v1.4.0-bio-alpha.1

This alpha introduces the expanded systems ontology for biopolitical analysis while preserving the stable Strategic/Biopolitical lens contract.

## Thesis

Biopolitics is the multi-system governance of life through institutions, markets, companies, platforms, technologies, norms, incentives, and behavioral design.

## Systems axes

1. Human — body, attention, fear, desire, health, identity, productivity.
2. Society — norms, shame, status, morality, family, education, belonging.
3. State — law, welfare, policing, security, borders, statistics, population management.
4. Market — debt, prices, scarcity, consumption, labor discipline, incentives.
5. Corporate / platforms — data extraction, productivity metrics, insurance, platform dependency.
6. Geopolitics — migration, sanctions, war, demography, food, energy, population pressure.
7. Technology — surveillance, AI, platforms, biometrics, infrastructure, automation.
8. Behavioral engineering — nudges, addiction loops, gamification, defaults, friction, UX control.

## Compatibility

The expanded systems map is optional. Existing `v1.3.0-bio` JSON imports remain valid because the base six-layer schema is preserved. When a biopolitical import does not contain `systems.items`, the app derives a default systems map from the imported subject and lens.

## Acceptance

- Strategic mode remains unchanged.
- Biopolitical mode includes the expanded systems prompt.
- Downloaded biopolitical HTML reports include `data-system-map="expanded-biopolitical"`.
- Tests guard the ontology tokens: human, society, state, market, corporate, geopolitics, technology, behavioral engineering.
