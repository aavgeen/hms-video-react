import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { AudioLevelDisplayType, Peer } from '../../types';
import './index.css';
import { VideoTileControls } from './Controls';
import { Avatar } from '../Avatar';
import { getVideoTileLabel } from '../../utils';

export interface VideoTileProps {
  /**
   * MediaStream to be displayed.
   */
  stream: MediaStream;
  /**
   * HMS Peer object for which the tile is shown.
   */
  peer: Peer;
  /**
   * Indicates if the stream belongs to the user viewing it. Used in labelling and styling.
   */
  isLocal?: boolean;
  /**
   * Indicates if the stream is generated by a camera, a screen-share or captured from canvas(or other media elements).
   */
  videoSource: 'screen' | 'camera' | 'canvas';
  /**
   * Indicates if the stream's audio is muted or not.
   */
  isAudioMuted?: boolean;
  /**
   * Indicates if the stream's video is muted or not.
   */
  isVideoMuted?: boolean;
  /**
   * Indicates whether to show if the audio of the stream is muted or not.
   */
  showAudioMuteStatus: boolean;
  /**
   * Indicates whether to show the volume of the stream's audio.
   */
  showAudioLevel?: boolean;
  /**
   * Indicates the volume of the stream as a number.
   * Ignored when showAudioLevel is false.
   */
  audioLevel?: number;
  /**
   * Indicates the fit type of the video inside the container.
   * 'contain' - Video is fit inside the container with it's original aspect-ratio.
   * 'cover' - Video is scaled to cover the whole area of the container.
   */
  objectFit: 'contain' | 'cover';
  /**
   * Aspect ratio of the container and the video(if objectFit is set to 'cover').
   * Actual dimensions are computed using the aspect-ratio and the dimensions of the parent of VideoTile component.
   * Ignored when displayShape is 'circle'.
   */
  aspectRatio?: {
    width: number;
    height: number;
  };
  /**
   * Shape of the video tile.
   * Use 'rectangle' and 'aspect ratio' 1:1 for square.
   */
  displayShape?: 'circle' | 'rectangle';
  /**
   * Indicates how to display the volume of the stream's audio.
   * Supported types are 'border', 'inline-wave' and 'inline-circle'.
   */
  audioLevelDisplayType?: AudioLevelDisplayType;
  /**
   * Indicates whether to show controls for remote muting/unmuting other participants.
   */
  allowRemoteMute: boolean;
  /**
   * Additional classes to be included for the components.
   */
  classes?: {
    /**
     * The top-level container.
     */
    root?: string;
    /**
     * The actual video element.
     */
    video?: string;
  };
  controlsComponent?: React.ReactNode;
}

interface VideoProps extends Partial<VideoTileProps> {
  isSquareOrCircle?: boolean;
  height?: number;
  className?: string;
}

const Video = forwardRef(
  (
    {
      objectFit,
      isSquareOrCircle,
      height = 1,
      aspectRatio = { width: 16, height: 9 },
      isLocal,
      videoSource,
      isAudioMuted,
      showAudioLevel,
      audioLevel,
      audioLevelDisplayType,
      displayShape,
      className,
    }: VideoProps,
    ref: React.Ref<HTMLVideoElement>,
  ) => {
    const getVideoStyles = () => {
      const videoStyle: React.CSSProperties = { objectFit };

      videoStyle['width'] = isSquareOrCircle
        ? `${height}px`
        : `${(aspectRatio.width / aspectRatio.height) * height}px`;
      videoStyle['transform'] =
        isLocal && videoSource === 'camera' ? 'scale(-1, 1)' : undefined;

      videoStyle['boxShadow'] =
        !isAudioMuted &&
        showAudioLevel &&
        audioLevel &&
        audioLevelDisplayType === 'border'
          ? `0px 0px ${0.12 * audioLevel}px #0F6CFF, 0px 0px ${0.8 *
              audioLevel}px #0F6CFF`
          : undefined;

      return videoStyle;
    };

    return (
      <video
        muted
        autoPlay
        className={`h-full ${className} ${
          displayShape === 'circle' ? 'rounded-full' : ''
        }`}
        ref={ref}
        style={getVideoStyles()}
      ></video>
    );
  },
);

export const VideoTile = ({
  stream,
  peer,
  isLocal = false,
  videoSource = 'camera',
  audioLevel,
  isAudioMuted = false,
  isVideoMuted = false,
  showAudioMuteStatus = true,
  showAudioLevel = true,
  objectFit = 'cover',
  aspectRatio = { width: 16, height: 9 },
  displayShape = 'rectangle',
  audioLevelDisplayType = 'border',
  allowRemoteMute = false,
  classes = {
    root: '',
    video: 'rounded-lg shadow-lg',
  },
  controlsComponent,
}: VideoTileProps) => {
  const [height, setHeight] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const label = getVideoTileLabel(peer.displayName, isLocal, videoSource);
  const isSquare =
    displayShape === 'rectangle' && aspectRatio.width === aspectRatio.height;
  const isCircle = displayShape === 'circle';
  const isSquareOrCircle = isSquare || isCircle;

  useEffect(() => {
    const videoTile = videoRef.current?.parentElement;
    const parent = videoTile?.parentElement;
    const height = parent?.getBoundingClientRect().height as number;
    setHeight(height);
  }, [stream, aspectRatio, displayShape]);

  useEffect(() => {
    videoRef.current!.srcObject = videoRef && videoRef.current && stream;
  }, [videoRef, stream]);

  return (
    <div
      className={`video-tile flex h-full relative items-center m-2 ${classes.root}`}
      style={{ width: isSquareOrCircle ? `${height}px` : undefined }}
    >
      <Video
        ref={videoRef}
        objectFit={objectFit}
        isSquareOrCircle={isSquareOrCircle}
        height={height}
        aspectRatio={aspectRatio}
        isLocal={isLocal}
        videoSource={videoSource}
        isAudioMuted={isAudioMuted}
        showAudioLevel={showAudioLevel}
        audioLevel={audioLevel}
        audioLevelDisplayType={audioLevelDisplayType}
        displayShape={displayShape}
        className={classes.video}
      />
      {isVideoMuted && (
        <div className="absolute left-0 right-0 mx-auto text-center z-10">
          <Avatar label={peer.displayName} />
        </div>
      )}
      {controlsComponent ? (
        controlsComponent
      ) : (
        <VideoTileControls
          label={label}
          isAudioMuted={isAudioMuted}
          showAudioMuteStatus={showAudioMuteStatus}
          showGradient={!isCircle}
          allowRemoteMute={allowRemoteMute}
          showAudioLevel={showAudioLevel && audioLevelDisplayType !== 'border'}
          audioLevelDisplayType={audioLevelDisplayType}
          audioLevel={audioLevel}
        />
      )}
    </div>
  );
};
