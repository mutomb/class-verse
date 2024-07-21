import React, { FC, EventHandler, CSSProperties, useEffect, useRef, useState} from 'react'
import { Box, FormControl} from '@mui/material'
import { SxProps, Theme } from '@mui/material/styles'
import { DeltaStatic, Sources, StringMap, } from 'quill';
import  { Value, UnprivilegedEditor, Range } from 'react-quill'
// import ReactQuill, { Value, UnprivilegedEditor, Range } from 'react-quill'
// import 'react-quill/dist/quill.snow.css'
import renderHTML from "react-render-html";

interface Editor{
  onChange?: (value: string, delta: DeltaStatic, source: Sources, editor: UnprivilegedEditor) => void,
  modules?: StringMap,
  value: Value,
  placeholder?: string,
  bounds?: string | HTMLElement,
  children?: React.ReactElement<any>,
  className?: string,
  defaultValue?: Value,
  formats?: string[],
  id?: string,
  onChangeSelection?: (selection: Range, source: Sources, editor: UnprivilegedEditor) => void,
  onFocus?: (selection: Range, source: Sources, editor: UnprivilegedEditor) => void,
  onBlur?: (previousSelection: Range, source: Sources, editor: UnprivilegedEditor) => void,
  onKeyDown?: EventHandler<any>,
  onKeyPress?: EventHandler<any>,
  onKeyUp?: EventHandler<any>,
  preserveWhitespace?: boolean,
  readOnly?: boolean,
  scrollingContainer?: string | HTMLElement,
  style?: CSSProperties,
  tabIndex?: number,
  sx?: SxProps<Theme>
}
const Editor: FC<Editor> = ({onChange, modules, value, placeholder, bounds, children, className="", defaultValue, formats, id,
                             onChangeSelection=undefined, onFocus, onBlur, onKeyDown, onKeyPress, onKeyUp, preserveWhitespace, readOnly, scrollingContainer, style, tabIndex, sx}) => {
  const [Editor, setEditor] = useState(<></>)
  useEffect(()=>{
    const ReactQuill = require('react-quill');
    return setEditor(
      <ReactQuill
        modules={modules}
        onChange={onChange}
        value={value}
        theme={'snow'}
        className={className}
        placeholder={placeholder}
        bounds={bounds}
        defaultValue={defaultValue}
        formats={formats}
        id={id}
        onChangeSelection={onChangeSelection}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onKeyPress={onKeyPress}
        preserveWhitespace={preserveWhitespace}
        readOnly={readOnly}
        scrollingContainer={scrollingContainer}
        style={{ cursor: 'pointer !important' }}
        tabIndex={tabIndex}>
          {children}
        </ReactQuill>);
  },[])
  return (
  <FormControl
    aria-label="editor"
    sx={{
      width: '100%',
      my: {xs: 2, md: 0},
      mr: { xs: 0, md: 0 },
      ['& .ql-toolbar.ql-snow']: {
        bgcolor: (theme)=> `${theme.palette.primary.main} !important`, border: '1px solid rgba(13, 106, 105, 0.972)', borderTopLeftRadius: {xs: 2, md: 4}, borderTopRightRadius: {xs: 2, md: 4}
      },
      ['& .ql-container.ql-snow']: {
        border: '1px solid rgba(13, 106, 105, 0.972) !important',
        borderTop: 'none', borderBottomLeftRadius: {xs: 2, md: 4}, borderBottomRightRadius: {xs: 2, md: 4}
      },
      ['& .ql-font.ql-picker']: {
        color: (theme)=> `${theme.palette.primary.contrastText} !important`,
      },
      ['& .ql-picker-options']: {
        border: 'none',
        borderLeftColor: (theme)=> `${theme.palette.secondary.main} !important`, borderRightColor: (theme)=> `${theme.palette.secondary.main} !important`, borderTopColor: (theme)=> `${theme.palette.primary.main} !important`, borderBottomColor: (theme)=> `${theme.palette.primary.main} !important`, borderStyle: 'solid', borderWidth: {xs: 1, sm: 2},
        bgcolor: (theme)=> theme.palette.mode ==='dark'?`rgba(0,0,0,0.7) !important`:`rgba(255,255,255,0.7) !important`,
        ['& .ql-picker-item']: {
          color: (theme)=> `${theme.palette.text.primary} !important`, '&:hover':{color: (theme)=> `${theme.palette.primary.contrastText} !important`, bgcolor: (theme)=> `${theme.palette.primary.main} !important`}
        },
      },
      ['& .ql-editor.ql-blank']: {
        bgcolor: 'background.paper', height: 400,
      },
      ['& .ql-editor']: {
        bgcolor: 'background.paper', height: 400, overflow: 'scroll', scrollbarWidth: 'thin !important', scrollbarColor: 'primary.main',
      },
      ['& .ql-picker-item']: {
        borderColor: (theme)=> theme.palette.mode ==='light'?`rgba(0,0,0,0.7)`:`rgba(255,255,255,0.7)`,
      },
      ['& .ql-picker-label']: {
        color: (theme)=> `${theme.palette.primary.contrastText} !important`
      },
      ['& .ql-picker-label svg .ql-stroke']: {
        stroke: (theme)=> `${theme.palette.primary.contrastText} !important`,
      },
      ['& .ql-snow.ql-toolbar button svg .ql-stroke']: {
        stroke: (theme)=> `${theme.palette.primary.contrastText} !important`,
      },
      ['& .ql-snow.ql-toolbar button svg .ql-fill']: {
        fill: (theme)=> `${theme.palette.primary.contrastText} !important`,
      },
      ['& .ql-snow .ql-icon-picker .ql-picker-label svg .ql-stroke']: {
        stroke: (theme)=> `${theme.palette.primary.contrastText} !important`,
      },
      ['& .ql-snow .ql-icon-picker .ql-picker-label svg .ql-fill']: {
        fill: (theme)=> `${theme.palette.primary.contrastText} !important`,
      },
      ['& .ql-snow .ql-color-picker .ql-picker-label svg .ql-stroke']: {
        stroke: (theme)=> `${theme.palette.primary.contrastText} !important`,
      },
      ['& .ql-snow .ql-color-picker .ql-picker-label svg .ql-fill']: {
        fill: (theme)=> `${theme.palette.primary.contrastText} !important`,
      },
      ['& .ql-snow a']: {
        bgcolor: 'unset', color: (theme)=> `${theme.palette.primary.main} !important`
      },
      ['& .ql-snow p']: {
        bgcolor: 'unset', color: (theme)=> `${theme.palette.text.primary} !important`,
      },
      ...sx
    }}>
      {!readOnly? Editor: 
      (<Box component='div' className='quill' sx={{width: '100%', cursor: 'pointer', scrollbarWidth: {xs: 'none', md: 'thin'}, scrollbarColor: 'primary.main', ...sx}}>
        <Box component='div' className='ql-container ql-snow ql-disabled' sx={{width: '100%'}}>
         <Box component='div' className='ql-editor' sx={{width: '100%'}}>
          {renderHTML(value)}
         </Box>
        </Box>
      </Box>)}
  </FormControl>)
}
export default Editor