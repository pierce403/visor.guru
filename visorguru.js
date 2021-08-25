function doGraphQL() {
    let rightnow = Math.round(new Date().getTime()/1000);
    let today = rightnow - rightnow%86400;
    
    var query = `query {
  users(where:{id: "0xb04e72fb3cdd9f1501f72ec55e16a9956ad35d48"})
  {
    id
    visorsOwned{
      id
      hypervisorCount
      hypervisorShares{
        shares
        initialUSD
        hypervisor{
          symbol
          pricePerShare
          tvlUSD
        }
      }
    }
  }

    }`;

    fetch('https://api.thegraph.com/subgraphs/name/visorfinance/visor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query,
            })
        })
        .then(r => r.json())
        .then(function (data) {
            console.log('data returned:', data);
        /*
            for (entry in data['data']['pairDayDatas']) {
                let token0 = data['data']['pairDayDatas'][entry]['token0']['symbol'];
                let token1 = data['data']['pairDayDatas'][entry]['token1']['symbol'];
                seriesNames.push(token0+'/'+token1);
                console.log(token0+'/'+token1)
                getProfits(data['data']['pairDayDatas'][entry]['pairAddress'],entry,token0+'/'+token1);
                console.log("addr is "+data['data']['pairDayDatas'][entry]['pairAddress']);
            }
      */
        });
}
