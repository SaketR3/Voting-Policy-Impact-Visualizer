import './App.css'
import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Chart } from 'react-google-charts';

export default function App() {
  const file = '/voter-turnout.csv';

  const [demographicMapData, setDemographicMapData] = useState([]);
  const [votingScoreMapData, setVotingScoreMapData] = useState([]);
  const [votingScoreMapRange, setVotingScoreMapRange] = useState([0, 34.5]);
  const [demographicMapTitle, setDemographicMapTitle] = useState('Voter Registration');
  const [votingScoreMapTitle, setVotingScoreMapTitle] = useState('Overall Voter Fairness Score');
  
  const [parsedData, setParsedData] = useState([]);
  const [showMap, setShowMap] = useState(false);

  const demographicMapOptions = {
    region: 'US',
    displayMode: 'regions',
    resolution: 'provinces',
    colorAxis: { minValue: 20, maxValue: 80, colors: ['#ddd1e8', '#a65aed'] },
    datalessRegionColor: '#e3e3e3',
    legend: { position: 'top', alignment: 'end' },
  };

  const votingScoreMapOptions = {
    region: 'US',
    displayMode: 'regions',
    resolution: 'provinces',
    colorAxis: { minValue: votingScoreMapRange[0], maxValue: votingScoreMapRange[1], colors: ['#dceff5', '#3480eb'] },
    datalessRegionColor: '#e3e3e3',
  };

  const parseCSV = () => {
    fetch(file)
    .then(res => res.text())
    .then(csv => {
      Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          setParsedData(results.data);
        },
      });
    });
  };

  const changeDemographicMap = (column) => {
    const newDemographicMapData = [];
    
    const header = ['State', column];
    newDemographicMapData.push(header);

    for (var i = 0; i < parsedData.length; i++) {
      if (parsedData[i][column] != 'Unknown') {
        const state = [parsedData[i]['State'], parseFloat(parsedData[i][column])];
        newDemographicMapData.push(state);
      }
    }

    setDemographicMapData(newDemographicMapData);
  }

  const changeVotingScoreMap = (column, minValue, maxValue) => {
    const newVotingScoreMapData = [];
    
    const header = ['State', column];
    newVotingScoreMapData.push(header);

    for (var i = 0; i < parsedData.length; i++) {
      if (parsedData[i][column] != 'Unknown') {
        const state = [parsedData[i]['State'], parseFloat(parsedData[i][column])];
        newVotingScoreMapData.push(state);
      }
    }

    setVotingScoreMapRange([minValue, maxValue]);
    setVotingScoreMapData(newVotingScoreMapData);
  }

  useEffect(() => {
    parseCSV();
  }, [])

  useEffect(() => {
    changeDemographicMap('Percent of Population that Registered to Vote');
    changeVotingScoreMap('Overall Voter Fairness Score (out of 34.5)', 0, 34.5);
    setShowMap(true);
  }, [parsedData]);

  return (
    <div className='container'>
      <div className='banner'>
        <h1 className='banner-text banner-heading'>Voter patterns, visualized</h1>
        <div className='banner-paragraph-container'>
          <p className='banner-text banner-paragraph'>
            For years, many states have been increasing their voter restrictions. While these 
            states usually claim that these measures increase election security, 
            many groups have pointed out that they disproportionately affect people of color. 
          </p>
          <p className='banner-text banner-paragraph'>
            That's where this visualization comes in. With the different toggles, you can more simply 
            compare how voting restrictions affect different demographics. The top map lets you view 
            certain demographics, while the bottom map lets you view certain voting fairness categories. 
          </p>
          <p className='banner-text banner-paragraph'>
            By configuring the different toggles and comparing the two maps, you can reach important 
            conclusions about how certain voting policies impact the turnout of different demographics. 
          </p>
        </div>
      </div>

      <div className='button-grouping'>
        <button onClick={() => {changeDemographicMap('Percent of Population that Registered to Vote'); setDemographicMapTitle('Voter Registration')}}>Voter Registration</button>
        <button onClick={() => {changeDemographicMap('Percentage of Population that Voted'); setDemographicMapTitle('Voter Turnout')}}>Voter Turnout</button>
      </div>
      <div className='button-grouping'>
        <button onClick={() => {changeDemographicMap('Percent of Females that Voted'); setDemographicMapTitle('Female Turnout')}}>Female Turnout</button>
        <button onClick={() => {changeDemographicMap('Percent of Males that Voted'); setDemographicMapTitle('Male Turnout')}}>Male Turnout</button>
      </div>
      <div className='button-grouping'>
        <button onClick={() => {changeDemographicMap('Percent of Whites that Voted'); setDemographicMapTitle('White Turnout')}}>White Turnout</button>
        <button onClick={() => {changeDemographicMap('Percent of African Americans that Voted'); setDemographicMapTitle('African American Turnout')}}>African American Turnout</button>
        <button onClick={() => {changeDemographicMap('Percent of Latinos that Voted'); setDemographicMapTitle('Latino Turnout')}}>Latino Turnout</button>
        <button onClick={() => {changeDemographicMap('Percent of Asians that Voted'); setDemographicMapTitle('Asian Turnout')}}>Asian Turnout</button>
      </div>
      <div className='button-grouping'>
        <button onClick={() => {changeDemographicMap('Percent of Population Aged 18-24 that Voted'); setDemographicMapTitle('Ages 18-24 Turnout')}}>Ages 18-24 Turnout</button>
        <button onClick={() => {changeDemographicMap('Percent of Population Aged 25-34 that Voted'); setDemographicMapTitle('Ages 25-34 Turnout')}}>Ages 25-34 Turnout</button>
        <button onClick={() => {changeDemographicMap('Percent of Population Aged 35-44 that Voted'); setDemographicMapTitle('Ages 35-44 Turnout')}}>Ages 35-44 Turnout</button>
        <button onClick={() => {changeDemographicMap('Percent of Population Aged 45-64 that Voted'); setDemographicMapTitle('Ages 45-64 Turnout')}}>Ages 45-64 Turnout</button>
        <button onClick={() => {changeDemographicMap('Percent of Population 65 or Above that Voted'); setDemographicMapTitle('Ages Over 65 Turnout')}}>Ages Over 65 Turnout</button>
      </div>
      <p className='note'>Note: States in gray did not have data available for them.</p>

      <h2 className='map-title'>{demographicMapTitle.toUpperCase()}</h2>
      {showMap && <Chart
        chartType='GeoChart'
        width='100%'
        height='425px'
        data={demographicMapData}
        options={demographicMapOptions}
      />}
      {showMap && <Chart
        chartType='GeoChart'
        width='100%'
        height='425px'
        data={votingScoreMapData}
        options={votingScoreMapOptions}
      />}
      <h2 className='map-title' id='map-title-bottom'>{votingScoreMapTitle.toUpperCase()}</h2>

      <div className='button-grouping' id='first-voting-score-grouping'>
        <button onClick={() => {changeVotingScoreMap('Representation & Participation Score (out of 6)', 0, 6); setVotingScoreMapTitle('Representation & Participation Score')}}>Representation & Participation Score</button>
        <button onClick={() => {changeVotingScoreMap('Election Security Score (out of 7)', 0, 7); setVotingScoreMapTitle('Election Security Score')}}>Election Security Score</button>
        <button onClick={() => {changeVotingScoreMap('Independence & Integrity Score (out of 6)', -1, 6); setVotingScoreMapTitle('Independence & Integrity Score')}}>Independence & Integrity Score</button>
      </div>
      <div className='button-grouping'>
        <button onClick={() => {changeVotingScoreMap('Ease of Registering to Vote (out of 5)', -1, 5); setVotingScoreMapTitle('Ease of Voter Registration')}}>Ease of Voter Registration</button>
        <button onClick={() => {changeVotingScoreMap('Ease of Voting In-Person (out of 5.5)', -2, 5.5); setVotingScoreMapTitle('Ease of Voting In-Person')}}>Ease of Voting In-Person</button>
        <button onClick={() => {changeVotingScoreMap('Ease of Voting By Mail (out of 5)', -2, 5); setVotingScoreMapTitle('Ease of Voting By Mail')}}>Ease of Voting By Mail</button>
      </div>
      <div className='button-grouping'>
        <button onClick={() => {changeVotingScoreMap('Overall Voter Fairness Score (out of 34.5)', 0, 34.5); setVotingScoreMapTitle('Overall Voter Fairness Score')}}>Overall Voter Fairness Score</button>
      </div>
      <p className='data-description'>
        The demographic data is from the US Census Bureau's November 2020 <a href='https://www.census.gov/data/tables/time-series/demo/voting-and-registration/p20-585.html' target='_blank'>election data</a> (tables 4a - 4c). 
        The voting fairness data is from the Movement Advancement Project (MAP)'s <a href='https://www.lgbtmap.org/democracy-maps/ratings_by_state' target='_blank'>Democracy Ratings</a> - their 
        website also provides more information about each of the voting fairness categories and a profile of each state. 
      </p>

      <div className='footer'>
          <p className='footer-credit'>Designed and programmed by Saket Reddy</p>
          <div className='footer-column'>
              <p className='footer-header'>Contact</p>
              <p className='footer-body'>sreddyj2023@gmail.com</p>
          </div>
          <div className='footer-column'>
              <p className='footer-header footer-code-header'>Code</p>
              <a href='https://github.com/SaketR3' target='_blank' className='footer-body footer-code-body underline'>GitHub</a>
          </div>
      </div>
    </div>
  )
}

