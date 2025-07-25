import React from 'react';
import Plot from 'react-plotly.js';

const AnalyticsGraph = ({ data, layout }) => {
  if (!data || !layout) return null;

  return (
    <div className="flex justify-center overflow-x-auto">
      <Plot
        data={data}
        layout={{
          ...layout,
          width: undefined,
          height: undefined,
          autosize: true,
          margin: { l: 50, r: 50, t: 50, b: 50 }
        }}
        config={{
          responsive: true,
          displayModeBar: true,
          displaylogo: false,
          modeBarButtonsToRemove: [
            'lasso2d',
            'select2d',
            'toggleSpikelines',
          ],
          toImageButtonOptions: {
            format: 'png',
            filename: 'analytics_chart',
            height: 500,
            width: 700,
            scale: 2
          }
        }}
        style={{ width: '100%', height: '600px' }}
      />
    </div>
  );
};

export default AnalyticsGraph;
