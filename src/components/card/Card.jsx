import React from 'react'

const Card = ({ item }) => {
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
    return (
        <div className="content__card">
            <div className="content__card-number">
                <p><a style={{
                    color:"#FFF"
                }} href={'/act?id=' + item.id}>№ {item.id}</a></p>
            </div>
            <div className="content__card-desc">
                <p>{formatDate(item.createdAt)}</p>
                <p>{item.city}</p>
                <p>{item.organization}</p>
                <p>{item.type}</p>
                <p>{item.category.name}</p>
                <p>{item.attribute.name}</p>
                <p>{item.units}</p>
                <p>{item.supplier}</p>
                <p>№ Акта: {item.id}</p>
                <p><span>Видео: {item.videos?.length}</span><span style={{ marginLeft: '10px' }}>Фото: {item.images?.length}</span></p>
            </div>
        </div>
    )
}

export default Card
