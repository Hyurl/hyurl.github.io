# Concept

A **sfn** application will start at least two processes, a master and a worker.
The master host all workers, but itself doesn't start any server, the worker 
will start servers and listen ports.

## How to use?

It is very simple to turn on more workers, just edit your `config.ts` file, 
set `workers` an array that carries several names, e.g. `["A", "B", "C"]`, will
start three workers, A, B and C.

## Communications between workers and the master

Multi-processing in **sfn** is backed by 
[sfn-worker](https://github.com/hyurl/sfn-worker), it provides a very 
easy-to-use, however efficient way that allows you send and receive messages 
from one worker to another, or to/from the master, please go learn it if you 
have any specific needs.