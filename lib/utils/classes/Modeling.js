import logUpdate from 'log-update';
import asciichart from 'asciichart';

import { stats, chunkify } from './../index';

const { pearsonCorrelation, mean } = stats;

// Procedure : Plot graph.
const config = {
  padding: '       ', // padding string for label formatting (can be overrided)
  offset: 3, // axis offset from the left (min 2)
  height: 10, // any height you want
  format: (x, i) => {
    return ('       ' + x.toFixed(2)).slice(-'       '.length);
  },
};

class Modeling {
  constructor(options = {}) {
    this.options = Object.assign(
      {},
      {
        series: options.series ? options.series : [],
        lookback: options.lookback ? options.lookback : 30,
        complexity: options.complexity ? options.complexity : null,
        correlation: options.correlation ? options.correlation : 0.5,
        template: options.template ? options.template : [],
        plotPrice: options.plotPrice ? options.plotPrice : false,
        plotMeanPrice: options.plotMeanPrice ? options.plotMeanPrice : false,
        plotAnalysis: options.plotAnalysis ? options.plotAnalysis : false,
      },
      options,
    );

    this.priceSeries = [];
  }

  start() {
    const {
      series,
      lookback,
      complexity,
      correlation,
      template,
      plotPrice,
      plotMeanPrice,
      plotAnalysis,
    } = this.options;

    if (series && series.length && lookback && template && template.length) {
      // console.log(`--- Testing for lookback : ${lookback} -------------------------------------------------------------------------------\n`);

      // Step 1: Set price series.
      for (let c = 0; c < complexity; c += 1) {
        this.priceSeries.push(series.slice(c, lookback + c));
      }

      // Plot - price series.
      if (plotPrice) {
        this.priceSeries.slice(0, complexity).map((elts) => {
          console.log('--------------------------------------------');
          console.clear();
          console.log(asciichart.plot(elts, config));
        });
      }

      // Step 2: Simplify pattern.
      const meanPriceSeries = this.priceSeries.map((r) => {
        const tmpChk = chunkify(r, complexity, true);
        return tmpChk.map((x) => mean(x));
      });

      // Plot - mean series.
      if (plotMeanPrice) {
        meanPriceSeries.map((elts) => {
          console.log('--------------------------------------------');
          console.log(asciichart.plot(elts, config));
        });
      }

      // Step 3: Check correlation.
      const correlationSeries = meanPriceSeries.map((elts) => {
        const pC = pearsonCorrelation(elts, template);
        return pC > correlation ? 1 : 0;
      });

      const corelation = mean(correlationSeries);
      return correlationSeries;
    } else {
      return void 0;
    }
  }
}

export default Modeling;
