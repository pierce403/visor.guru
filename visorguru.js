let fullmsg=""

let totalStarting=0;
let totalCurrent=0;

function msg(input)
{
  fullmsg=fullmsg+input+'\n';
  document.getElementById("msg").textContent = fullmsg
}

function doGraphQL() {

    let myAddr = window.location.hash.substr(1);    
    document.getElementById('addr').value=myAddr;
    console.log("Fetching for "+myAddr);

    var query = `query {
  users(where:{id: "`+myAddr.toLowerCase()+`"})
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

            fullmsg=""
            let nvis=0
            try
            {
              nvis = data['data']['users'][0]['visorsOwned'][0]['hypervisorCount']
            }
            catch(error)
            {
              msg("Invalid address");
              //msg(error);
              return;
            }
  
            msg("You have "+nvis+" hypervisors.")
  
            totalStarting=0;
            totalCurrent=0;

            let shares = data['data']['users'][0]['visorsOwned'][0]['hypervisorShares'];
            for (entry in shares) {

                msg('\n'+shares[entry]['hypervisor']['symbol'])

                let initialUSD = shares[entry]['initialUSD']
                let myShares = shares[entry]['shares']
                let pricePerShare = shares[entry]['hypervisor']['pricePerShare']
                let currentUSD = myShares*pricePerShare
                let gainz = currentUSD-initialUSD
                let gainzPct = (currentUSD-initialUSD)/initialUSD*100
                totalStarting+=Number(initialUSD);
                totalCurrent+=Number(currentUSD);
 
                msg("Starting value: $"+Number(initialUSD).toFixed(2))
                msg("Current value: $"+Number(currentUSD).toFixed(2))
                msg("Gainz: $"+Number(gainz).toFixed(2)+" ("+Number(gainzPct).toFixed(2)+"%)")
            }

            let totalGainz = totalCurrent-totalStarting
            let totalGainzPct = totalGainz/totalStarting*100
            msg("\nTotal")
            msg("Total Starting value: $"+Number(totalStarting).toFixed(2))
            msg("Total Current value: $"+Number(totalCurrent).toFixed(2))
            msg("Total Gainz: $"+Number(totalGainz).toFixed(2)+" ("+Number(totalGainzPct).toFixed(2)+"%)")
      
        });
}

doGraphQL();
