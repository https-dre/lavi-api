import os from "os";
import process from "process";
import cluster from "node:cluster";
import { executeServer } from "./server";

export const executeInClusterMode = async () => {
  const workers = os.cpus().length
  if(cluster.isPrimary) {
    for (let i = 0; i < workers; i++)
      cluster.fork()
  } else {
    executeServer().then(() => {
      console.log(`Worker ${process.pid} started`)
    })
  }
}