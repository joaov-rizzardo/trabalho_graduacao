CREATE VIEW vw_level_ranking AS (
	SELECT
		u.userId,
		u.username,
		u.selectedAvatar,
		ul.currentLevel
	FROM
		UserLevel AS ul
	INNER JOIN
		User AS u ON u.userId = ul.userId
	ORDER BY ul.currentLevel DESC
);

CREATE VIEW vw_points_ranking AS (
	SELECT
		u.userId,
		u.username,
		u.selectedAvatar,
		ul.points
	FROM
		UserLevel AS ul
	INNER JOIN
		User AS u ON u.userId = ul.userId
	ORDER BY ul.points DESC
);

