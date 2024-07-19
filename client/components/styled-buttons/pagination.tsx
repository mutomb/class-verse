import React, {ChangeEvent, FC} from 'react';
import {Pagination as MuiPagination, PaginationItem, Stack} from '@mui/material';
import {ArrowBack, ArrowForward} from '@mui/icons-material';
interface PaginationProps{
  onChange: (event: ChangeEvent<unknown>, page: number) => void,
  count?: number,
  page?: number,
  siblingCount?: number,
  size?: 'small' | 'medium' | 'large',
  shape?: 'circular' | 'rounded',
  variant: 'text' | 'outlined',
  selected?: boolean;
  style?: any
}
const Pagination: FC<PaginationProps> = ({style, count=10, onChange, page=1, siblingCount=2, size='small', shape='circular', variant='text'}) => {
  return (
    <Stack spacing={2}>
      <MuiPagination
        // sx={{
        //   color: 'primary.main',
        //   ...style
        // }}
        color="primary"
        count={count}
        page={page}
        hideNextButton={page === count}
        hidePrevButton={page === 1}
        onChange={onChange}
        siblingCount={siblingCount}
        defaultPage={page}
        shape={shape}
        size={size}
        variant={variant}
        renderItem={(item) => {
          return(<>
          <PaginationItem {...item} disabled={item.page===page} selected={item.page===page}  slots={{ previous: ArrowBack, next: ArrowForward }}
            sx={{cursor: 'pointer', transform: 'unset', '&:hover':{color: item.selected? 'primary.dark': 'primary.contrastText', borderColor: item.selected? 'primary.dark': 'secondary.dark', bgcolor: item.selected? 'primary.main': 'secondary.main', boxShadow: 2, transform: 'translateY(-3px) scale(1.01)', transition: (theme)=> theme.transitions.create(['transform', 'background-color', 'box-shadow', 'color', 'border-color'], {duration: 100}) },
                 color: item.selected? 'primary.contrastText': 'text.primary', bgcolor: item.selected? 'primary.main': 'unset'}}
          />
        </>)}}
      />
    </Stack>
  );
}
export default Pagination