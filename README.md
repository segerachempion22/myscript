The method I used to find them wasn't very hard. I started when transaction data and Sybil lists by LayerZero weren't published yet, so I parsed some wallet statistics from Dune into a MySQL database. After that, I looked for a way to parse wallets' LayerZero transactions, but one day all the data was published, which helped me a lot. So, I put it into a second MySQL database.

In the beginning, I wanted to find wallets that have the same LayerZero transaction history according to my database. However, I had never worked with such large datasets before. After many days of searching for ways to process the data, I abandoned this way and started to identify similar wallets manually. I searched my database for clusters of wallets that were created in the same week or had done the same number of transactions with the same volume using queries like this(i used different just to find out some strange activity clusters like in 1 day was created a lot of wallets with same stats and then i moved to scripts to check their onchain activity,check database screenshots in sybils/example for a examples)

            'SELECT TransactionsCount, UniqueActiveDays, InteractedContractsCount, LZAgeInDays, 
      			 ROUND(BridgedAmount * 0.98, 2) AS lower_bound,
       			 ROUND(BridgedAmount * 1.02, 2) AS upper_bound,
       			 COUNT(*)
			 FROM userstatistics
			 GROUP BY TransactionsCount, UniqueActiveDays, InteractedContractsCount, LZAgeInDays, lower_bound, upper_bound
			 HAVING COUNT(*) > 1;'.
Description of scripts
First file is Index.js this file is downloading layerzero transactions data from database into file data.csv(wallets that i need to check i store in wallets.txt)

Second file that i used is transfilter.js this file proceed data from data.csv and checking same onchain activity for wallets,if transfilter.js founds something it creates two json files with clusters(one is a list of wallets second is their onchain data)

Third file is walletremover.js it removes already proceeded wallets from database.

The structure of sybil data that i provided looks like: In syblis folder there are folders(named "sybils *number of wallets in cluster* wallets *their top in one public checker*" for every cluster that i found, in each you can see 3-5 files two of them is LIST of wallets AND onchain proofs that wallets have similar activity(some of them have diffrent chain evm path,for example one have arbitrum - fantom - optimism - core second have arbitrum-optimism - fantom - core,but in generaly their are sybils because sum of source chains,protocols are equal, just path have some difference) ALSO i provided screenshots from database with onchain stats in numbers.
