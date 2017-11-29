'use strict';

exports.isStar = true;
exports.runParallel = runParallel;

function runParallel(jobs, parallelNum, timeout = 1000) {
    return new Promise(function (resolve) {

        var curr = 0;
        var out = [];

        for (var i = 0; i < parallelNum; i++) {
            curr += 1;
            startJob(jobs[curr], curr);
        }

        function startJob(job, currentJobIndex) {
            var finish = function (result) {
                return finishJob(result, currentJobIndex);
            };

            new Promise(function (resolveJob, rejectJob) {
                job().then(resolveJob, rejectJob);
                setTimeout(rejectJob, timeout, new Error('Promise timeout'));
            })
                .then(finish)
                .catch(finish);
        }

        function finishJob(result, index) {
            out[index] = result;
            if (out.length === jobs.length) {
                resolve(out);

                return;
            }

            if (curr < jobs.length) {
                startJob(jobs[curr], curr++);
            }
        }
    });
}
