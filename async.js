'use strict';

exports.isStar = true;
exports.runParallel = runParallel;

function runParallel(jobs, parallelNum) {
    return new Promise(resolve => {

        var curr = 0;
        var out = [];
        if (!jobs.length) {
            resolve([]);
        }
        for (var i = 0; i < parallelNum; i++) {
            startJob(jobs[curr], curr+=1);
        }

        function startJob(job, currentJobIndex) {
            var finish = function (result) {
                return finishJob(result, currentJobIndex);
            };

            job().then(finish)
                .catch(finish);
        }

        function finishJob(result, index) {
            out[index] = result;
            if (curr === jobs.length) {
                resolve(out);
            }

            if (curr < jobs.length) {
                startJob(jobs[curr], curr++);
            }
        }
    });
}
