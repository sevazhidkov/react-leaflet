import {
  EventedProps,
  createElementHook,
  createLayerHook,
} from '@react-leaflet/core'
import { SVGOverlay as LeafletSVGOverlay } from 'leaflet'
import { ReactNode, Ref, forwardRef, useImperativeHandle } from 'react'
import { createPortal } from 'react-dom'

import { MediaOverlayOptions, updateMediaOverlay } from './ImageOverlay'

export interface SVGOverlayProps extends MediaOverlayOptions, EventedProps {
  children?: ReactNode
}

export const useSVGOverlayElement = createElementHook<
  LeafletSVGOverlay,
  SVGOverlayProps,
  SVGSVGElement
>(function createSVGOverlay(props) {
  const { bounds, ...options } = props
  const container = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'svg',
  )
  const instance = new LeafletSVGOverlay(container, bounds, options)
  return { instance, container }
}, updateMediaOverlay)

export const useSVGOverlay = createLayerHook(useSVGOverlayElement)

function SVGOverlayComponent(
  { children, ...options }: SVGOverlayProps,
  ref: Ref<LeafletSVGOverlay>,
) {
  const { instance, container } = useSVGOverlay(options).current
  useImperativeHandle(ref, () => instance)

  return container == null || children == null
    ? null
    : createPortal(children, container)
}

export const SVGOverlay = forwardRef(SVGOverlayComponent)
