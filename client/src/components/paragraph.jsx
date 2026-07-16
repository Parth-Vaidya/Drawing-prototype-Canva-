function Paragraph({ paragraph }) {

    return (
        <div
            className="paragraph"
            style={{
                top: paragraph.y
            }}
        >
            New Paragraph
        </div>
    );

}

export default Paragraph;