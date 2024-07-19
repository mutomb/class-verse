import React, {FC, ReactNode, useState} from 'react'
import { Favorite, FavoriteBorder } from '@mui/icons-material'
import { Rating, ratingClasses } from '@mui/material'

interface StyledRatingProps{
onChange?: ()=>void,
style?: any,
icon?: ReactNode,
emptyIcon?: ReactNode,
defaultValue?: number,
value?: number,
precision?: number,
max: number,
readOnly: boolean
}

const StyledRating: FC<StyledRatingProps> = ({onChange, style, icon, emptyIcon, defaultValue, value, precision, max, readOnly}) => {
    const [active, setActive] =useState({value: 0, color: 'unset'})
    const getActiveColor = (value) =>{
        setActive((prevActive)=>{
            if(value> 0 && value < max*0.5) return {...prevActive, value: value, color: 'error.light'}
            if(value >= max*0.5 && value < max*0.75) return {...prevActive, value: value, color: 'secondary.main'}
            if(value >= max*0.75) return {...prevActive, value: value, color: 'primary.main'}
            return {...prevActive, value: value, color: 'unset'}
        })
    }
    const getColor = (value) =>{
        if(value> 0 && value < max*0.5) 'error.light'
        if(value >= max*0.5 && value < max*0.75) return 'secondary.main'
        if(value >= max*0.75) return 'primary.main'
        return 'unset'
    }
    return(
        <Rating
        name="customized-rating"
        defaultValue={defaultValue || 0}
        getLabelText={(value: number) => `${value} Heart${value !== 1 ? 's' : ''}`}
        precision={precision || 0.1}
        icon={icon || <Favorite fontSize="inherit" />}
        emptyIcon={emptyIcon || <FavoriteBorder fontSize="inherit" />}
        value={value || 0} max={max || 5}
        onChange={onChange}
        onChangeActive={(e, newValue)=>getActiveColor(newValue)}
        readOnly={readOnly}
        sx={{mr: 1,
            '& > legend': { mt: 2 },
            [`& .${ratingClasses.iconFilled}`]: {
                color: getColor(value),
            },
            [`& .${ratingClasses.iconHover}`]: {
                color: active.color,
            },
            ...style
        }}/>
    )
}
export default StyledRating