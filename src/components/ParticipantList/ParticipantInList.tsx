import React from 'react';
import { Avatar } from '../TwAvatar';
import { Button } from '../Button';
import { MicOffIcon, MicOnIcon } from '../Icons';
import { Text } from '../Text';
import { ParticipantListClasses } from './ParticipantProps';
import { StylerType } from '../../types';

interface PropsType {
  styler?: StylerType<ParticipantListClasses>;
  name: string;
  isAudioEnabled?: boolean;
}

export const ParticipantInList = ({
  styler = () => '',
  name,
  isAudioEnabled,
}: PropsType) => {
  return (
    <span className={styler('menuItem')} role="menuitem">
      <div className={styler('menuText')}>
        <Avatar label={name} shape="square" classes={{ root: 'mr-2' }} />
        <Text variant="body" classes={{ root: 'flex-1 truncate' }} title={name}>
          {name}
        </Text>
      </div>
      <div className={styler('menuIconContainer')}>
        {isAudioEnabled ? (
          <div className={styler('onIcon')}>
            <Button iconOnly shape={'circle'} size={'sm'}>
              <MicOnIcon />
            </Button>
          </div>
        ) : (
          <div className={styler('offIcon')}>
            <Button
              iconOnly
              shape={'circle'}
              variant={'danger'}
              size={'sm'}
              active={isAudioEnabled}
            >
              <MicOffIcon />
            </Button>
          </div>
        )}
      </div>
    </span>
  );
};
