import React, { Component, HTMLAttributes, MouseEvent } from 'react';
import { getClassName } from '../../helpers/getClassName';
import { classNames } from '../../lib/classNames';
import { withPlatform } from '../../hoc/withPlatform';
import { HasPlatform } from '../../types';
import { canUseDOM, withDOM, DOMProps } from '../../lib/dom';

export interface PopoutWrapperProps extends HTMLAttributes<HTMLDivElement>, HasPlatform {
  hasMask?: boolean;
  fixed?: boolean;
  alignY?: 'top' | 'center' | 'bottom';
  alignX?: 'left' | 'center' | 'right';
  closing?: boolean;
}

export interface PopoutWrapperState {
  opened: boolean;
}

export type WindowTouchListener = (e: Event) => void;

export type ClickHandler = (e: MouseEvent<HTMLDivElement>) => void;

class PopoutWrapper extends Component<PopoutWrapperProps & DOMProps, PopoutWrapperState> {
  constructor(props: PopoutWrapperProps) {
    super(props);
    this.state = {
      opened: !props.hasMask,
    };
  }

  static defaultProps: PopoutWrapperProps = {
    hasMask: true,
    fixed: true,
    alignY: 'center',
    alignX: 'center',
    closing: false,
  };

  componentDidMount() {
    if (canUseDOM) {
      this.props.window.addEventListener('touchmove', this.preventTouch, { passive: false });
    }
  }

  componentWillUnmount() {
    // Здесь нужен последний аргумент с такими же параметрами, потому что
    // некоторые браузеры на странных вендорах типа Meizu не удаляют обработчик.
    // https://github.com/VKCOM/VKUI/issues/444
    if (canUseDOM) {
      // @ts-ignore (В интерфейсе EventListenerOptions нет поля passive)
      this.props.window.removeEventListener('touchmove', this.preventTouch, { passive: false });
    }
  }

  onFadeInEnd = (e?: React.AnimationEvent) => {
    if (!e || e.animationName === 'vkui-animation-full-fade-in') {
      this.setState({ opened: true });
    }
  };

  preventTouch: WindowTouchListener = (e: Event) => e.preventDefault();

  render() {
    const { alignY, alignX, closing, children, hasMask, fixed, platform, onClick, window, document, ...restProps } = this.props;
    const baseClassNames = getClassName('PopoutWrapper', platform);

    return (
      <div
        {...restProps}
        vkuiClass={classNames(baseClassNames, `PopoutWrapper--v-${alignY}`, `PopoutWrapper--h-${alignX}`, {
          'PopoutWrapper--closing': closing,
          'PopoutWrapper--opened': this.state.opened,
          'PopoutWrapper--fixed': fixed,
          'PopoutWrapper--masked': hasMask,
        })}
        onAnimationEnd={this.state.opened ? null : this.onFadeInEnd}
      >
        <div vkuiClass="PopoutWrapper__container">
          <div
            vkuiClass="PopoutWrapper__overlay"
            onClick={onClick} />
          <div vkuiClass="PopoutWrapper__content">
            {children}
          </div>
        </div>
      </div>
    );
  }
}

export default withPlatform(withDOM<PopoutWrapperProps>(PopoutWrapper));
