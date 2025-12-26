## Theory

GAs were introduced as a computational analogy of adaptive systems. They are modelled loosely on the principles of the evolution via natural selection, employing a population of individuals that undergo selection in the presence of variation-inducing operators such as mutation and recombination (crossover). A fitness function is used to evaluate individuals, and reproductive success varies with fitness.

The Algorithms:
- Randomly generate an initial population M(0)
- Compute and save the fitness u(m) for each individual m in the current population M(t)
- Define selection probabilities p(m) for each individual m in M(t) so that p(m) is proportional to (m)
- Generate M(t+1) by probabilistically selecting individuals from M(t) to produce offspring via genetic operators
- Repeat step 2 until satisfying solution is obtained.

The paradigm of GAs descibed above is usually the one applied to solving most of the problems presented to GAs. Though it might not find the best solution. more often than not, it would come up with a partially optimal solution.