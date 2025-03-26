import { Flex, Grid } from '@chakra-ui/react';
import React from 'react';

import type { UTXOTransaction } from 'types/api/qitmeer_tx';

import { currencyUnits } from 'lib/units';
import Tag from 'ui/shared/chakra/Tag';
import CurrencyValue from 'ui/shared/CurrencyValue';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import TxEntity from 'ui/shared/entities/tx/TxEntity';

interface Props {
  data: UTXOTransaction;
}

const TxDetailsWrapped = ({ data }: Props) => {
  return (
    <Grid columnGap={ 8 } rowGap={{ base: 3, lg: 3 }} templateColumns={{ base: 'minmax(0, 1fr)', lg: 'auto minmax(0, 1fr)' }}>
      <DetailsInfoItem.Label hint="Unique character string (TxID) assigned to every verified transaction">Transaction hash</DetailsInfoItem.Label>
      <DetailsInfoItem.Value flexWrap="nowrap">
        <TxEntity hash={ data.hash } noIcon noLink noCopy={ false }/>
      </DetailsInfoItem.Value>
      { data.block_hash && (
        <>
          <DetailsInfoItem.Label hint="block_hash">Block</DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <Flex flexWrap="nowrap" alignItems="center" maxW="100%">
              { data.block_hash }
            </Flex>
          </DetailsInfoItem.Value>

          <DetailsInfoItem.Label hint="block_hash">Block Order</DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <Flex flexWrap="nowrap" alignItems="center" maxW="100%">
              { data.block_order }
            </Flex>
          </DetailsInfoItem.Value>
        </>
      ) }
      <DetailsInfoItem.Label hint="Transaction Vin">From</DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Tag colorScheme="gray">{ data.vin }</Tag>
      </DetailsInfoItem.Value>

      { data.to_address && (
        <>
          <DetailsInfoItem.Label hint="Address receiving the transaction">To</DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <Flex flexWrap="nowrap" alignItems="center" maxW="100%">
              { data.to_address }
            </Flex>
          </DetailsInfoItem.Value>
        </>
      ) }

      <DetailsInfoItem.Label hint="Value sent in the native token (and MEER) if applicable">Value</DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <CurrencyValue value={ data.amount } currency={ currencyUnits.ether } flexWrap="wrap"/>
      </DetailsInfoItem.Value>
      <DetailsInfoItem.Label hint="Value sent in the native token (and MEER) if applicable">Vout Index</DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <CurrencyValue value={ data.index } currency={ currencyUnits.ether } flexWrap="wrap"/>
      </DetailsInfoItem.Value>
    </Grid>
  );
};

export default TxDetailsWrapped;
