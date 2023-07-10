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

CREATE VIEW vw_spending_by_category AS (
	SELECT
		B.value,
		B.category,
        B.spendingDate,
        B.userId
	FROM (
		SELECT
			bi.value AS value,
			ub.category AS category,
			payedAt AS spendingDate,
			ub.userId
		FROM
			UserBills AS ub
		INNER JOIN
			BillInstallments AS bi ON ub.billId = bi.billId
		WHERE
			isPayed = 1
		UNION ALL SELECT
			us.value AS value,
			us.category AS category,
			us.spentAt AS spendingDate,
			us.userId AS userId
		FROM
			UserSpendings AS us
	) AS B
);

