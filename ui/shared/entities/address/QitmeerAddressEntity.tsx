import type { As } from '@chakra-ui/react';
import { Flex, Skeleton, chakra } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import { useAddressHighlightContext } from 'lib/contexts/addressHighlight';
import * as EntityBase from 'ui/shared/entities/base/components';

import { distributeEntityProps, getIconProps } from '../base/utils';
import AddressIdenticon from './AddressIdenticon';

type LinkProps = EntityBase.LinkBaseProps & Pick<EntityProps, 'address'>;

const Link = chakra((props: LinkProps) => {
  const defaultHref = route({ pathname: '/qitmeer_address/[hash]', query: { ...props.query, hash: props.address } });

  return (
    <EntityBase.Link
      { ...props }
      href={ props.href ?? defaultHref }
    >
      { props.children }
    </EntityBase.Link>
  );
});

type IconProps = Pick<EntityProps, 'address' | 'isSafeAddress'> & EntityBase.IconBaseProps;

const Icon = (props: IconProps) => {
  if (props.noIcon) {
    return null;
  }

  const styles = {
    ...getIconProps(props.size),
    marginRight: props.marginRight ?? 2,
  };

  if (props.isLoading) {
    return <Skeleton { ...styles } borderRadius="full" flexShrink={ 0 }/>;
  }

  return (
    <Flex marginRight={ styles.marginRight }>
      <AddressIdenticon
        size={ props.size === 'lg' ? 30 : 20 }
        hash={ props.address }
      />
    </Flex>
  );
};

export type ContentProps = Omit<EntityBase.ContentBaseProps, 'text'> & Pick<EntityProps, 'address'> & { altHash?: string };

const Content = chakra((props: ContentProps) => {
  return <EntityBase.Content { ...props } text={ props.address }/>;
});

type CopyProps = Omit<EntityBase.CopyBaseProps, 'text'> & Pick<EntityProps, 'address'> & { altHash?: string };

const Copy = (props: CopyProps) => {
  return (
    <EntityBase.Copy
      { ...props }
      text={ props.address }
    />
  );
};

const Container = EntityBase.Container;

export interface EntityProps extends EntityBase.EntityBaseProps {
  address: string;
  isSafeAddress?: boolean;
  noHighlight?: boolean;
  noAltHash?: boolean;
}

const QitmeerAddressEntry = (props: EntityProps) => {
  const partsProps = distributeEntityProps(props);
  const highlightContext = useAddressHighlightContext(props.noHighlight);
  const altHash = props.address;
  if (altHash === undefined) {
    return '';
  }

  return (
    <Container
      // we have to use the global classnames here, see theme/global.ts
      // otherwise, if we use sx prop, Chakra will generate the same styles for each instance of the component on the page
      className={ `${ props.className } address-entity ${ props.noCopy ? 'address-entity_no-copy' : '' }` }
      data-hash={ highlightContext && !props.isLoading ? props.address : undefined }
      onMouseEnter={ highlightContext?.onMouseEnter }
      onMouseLeave={ highlightContext?.onMouseLeave }
      position="relative"
      zIndex={ 0 }
    >
      <Icon { ...partsProps.icon }/>
      <Link { ...partsProps.link }>
        <Content { ...partsProps.content } altHash={ altHash }/>
      </Link>
      <Copy { ...partsProps.copy } altHash={ altHash }/>
    </Container>
  );
};

export default React.memo(chakra<As, EntityProps>(QitmeerAddressEntry));

export {
  Container,
  Link,
  Icon,
  Content,
  Copy,
};
