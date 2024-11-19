import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { host } from '../host';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: 'rotate(0deg)',
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: 'rotate(180deg)',
      },
    },
  ],
}));

export default function CustomCard({ item }) {
  const [expanded, setExpanded] = React.useState(false);

  const formatDate = (isoDate) => {
    if (!isoDate) return '-';
    const date = new Date(isoDate);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date
        .getHours()
        .toString()
        .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    return formattedDate;
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ maxWidth: '100%' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {item.user.name.charAt(0).toUpperCase()}
          </Avatar>
        }
        // action={
        //   <IconButton aria-label="settings">
        //     <MoreVertIcon />
        //   </IconButton>
        // }
        title={item.user.name}
        subheader={formatDate(item.createdAt)}
      />
      {item.format == 'video' ? (
        <video
          style={{ width: '100%', height: '250px' }}
          controls
          poster={host + item.preview}
        >
          <source
            src={host + item.video}
            type="video/mp4"
          />
        </video>

      ) : (
        <CardMedia
          component="img"
          height="194"
          image={host + item.photo}
          alt="Paella dish"
        />
      )}
      <CardContent>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {item.comment}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography sx={{ marginBottom: 2 }}>Тип: {item.type}</Typography>
          <Typography sx={{ marginBottom: 2 }}>Город: {item.city}</Typography>
          <Typography sx={{ marginBottom: 2 }}>Транспортная единица: {item.category.name}</Typography>
          <Typography sx={{ marginBottom: 2 }}>Тип товара: {item.attribute.name}</Typography>
          <Typography sx={{ marginBottom: 2 }}>Номер тр. Единицы: {item.units}</Typography>
          <Typography sx={{ marginBottom: 2 }}>Поставщик: {item.supplier}</Typography>
          <Typography sx={{ marginBottom: 2 }}>Сопр. Документы: {item.doc}</Typography>
          <Typography sx={{ marginBottom: 2 }}>Ответственные: {item.responsible}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}