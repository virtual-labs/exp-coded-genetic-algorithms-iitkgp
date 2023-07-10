## Introduction

Genetic Algorithms are a form of Artificial Intelligence. They learn by evolving a fit set of solution to previously specified problem. The fundamental idea behind genetic algorithms is the same idea behind Darwinian evolution, survival of the fittest. Each potential solution to a problem in a genetic algorithm is represented by one individual. The fitter individuals are allowed to breed more often. By allowing fitter individuals to breed more often, the population tends toward the desired solution with time. This ability to tend towards a solution is comparable to reasoning capability.

Genetic algorithms have wonderfully diverse capabilities extending beyond those of Neural Networks. Genetic algorithms can solve simple linear problems and they can also solve much more complex higher dimensional problems, too. These capabilities are not different from Neural Networks, though. The power of genetic algorithms lies in there ability to do problems that rely on recursion and outside data structures. Genetic algorithms can solve recursive sequence like Fibbonnacci and process stacks; things no Neural Network can do. Genetic algorithms can even assume the form of a simple computer program. These capabilities are the most interesting (at least in my opinion). When coupled with an interpreted language like Java or Lisp, they can dynamically generate programs to solve the programmers needs.

Examples of real world genetic algorithm capabilities include:

- Artificial Limbs
- Stock market forecasting
- Intelligent Agents

## Theory

GAs were introduced as a computational analogy of adaptive systems. They are modelled loosely on the principles of the evolution via natural selection, employing a population of individuals that undergo selection in the presence of variation-inducing operators such as mutation and recombination (crossover). A fitness function is used to evaluate individuals, and reproductive success varies with fitness.

The Algorithms:
- Randomly generate an initial population M(0)
- Compute and save the fitness u(m) for each individual m in the current population M(t)
- Define selection probabilities p(m) for each individual m in M(t) so that p(m) is proportional to (m)
- Generate M(t+1) by probabilistically selecting individuals from M(t) to produce offspring via genetic operators
- Repeat step 2 until satisfying solution is obtained.

The paradigm of GAs descibed above is usually the one applied to solving most of the problems presented to GAs. Though it might not find the best solution. more often than not, it would come up with a partially optimal solution.